/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useMemo, useEffect, forwardRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { pipe, useAsyncList } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { store as blockEditorStore } from '../../store';
import BlockTypesList from '../block-types-list';
import InserterPanel from './panel';
import useBlockTypesState from './hooks/use-block-types-state';
import InserterListbox from '../inserter-listbox';
import { orderBy } from '../../utils/sorting';
import InserterNoResults from './no-results';
import useInsertionPoint from './hooks/use-insertion-point';

const getBlockNamespace = ( item ) => item.name.split( '/' )[ 0 ];

const MAX_SUGGESTED_ITEMS = 6;

/**
 * Shared reference to an empty array for cases where it is important to avoid
 * returning a new array reference on every invocation and rerendering the component.
 *
 * @type {Array}
 */
const EMPTY_ARRAY = [];

export function BlockTypesTab(
	{ rootClientId, onInsert, onHover, showMostUsedBlocks },
	ref
) {
	const [
		items,
		categories,
		collections,
		onSelectItem,
		allItems,
		createNewBlock,
	] = useBlockTypesState( rootClientId, onInsert );

	const insertionIndex = useSelect( ( select ) => {
		const { getBlockOrder } = select( blockEditorStore );

		// Last item.
		return getBlockOrder().length;
	} );

	const [ , onInsertBlocks ] = useInsertionPoint( { insertionIndex } );

	const onSelectGeneralItem = (
		{ name, initialAttributes, innerBlocks, syncStatus, content },
		shouldFocusBlock
	) => {
		const newBlock = createNewBlock( {
			content,
			name,
			initialAttributes,
			innerBlocks,
			syncStatus,
		} );

		onInsertBlocks( newBlock, undefined, shouldFocusBlock );
	};

	const suggestedItems = useMemo( () => {
		return orderBy( items, 'frecency', 'desc' ).slice(
			0,
			MAX_SUGGESTED_ITEMS
		);
	}, [ items ] );

	const uncategorizedItems = useMemo( () => {
		return items.filter( ( item ) => ! item.category );
	}, [ items ] );

	const itemsPerCategory = useMemo( () => {
		return pipe(
			( itemList ) =>
				itemList.filter(
					( item ) => item.category && item.category !== 'reusable'
				),
			( itemList ) =>
				itemList.reduce( ( acc, item ) => {
					const { category } = item;
					if ( ! acc[ category ] ) {
						acc[ category ] = [];
					}
					acc[ category ].push( item );
					return acc;
				}, {} )
		)( items );
	}, [ items ] );

	const itemsPerCollection = useMemo( () => {
		// Create a new Object to avoid mutating collection.
		const result = { ...collections };
		Object.keys( collections ).forEach( ( namespace ) => {
			result[ namespace ] = items.filter(
				( item ) => getBlockNamespace( item ) === namespace
			);
			if ( result[ namespace ].length === 0 ) {
				delete result[ namespace ];
			}
		} );

		return result;
	}, [ items, collections ] );

	// Hide block preview on unmount.
	useEffect( () => () => onHover( null ), [] );

	/**
	 * The inserter contains a big number of blocks and opening it is a costful operation.
	 * The rendering is the most costful part of it, in order to improve the responsiveness
	 * of the "opening" action, these lazy lists allow us to render the inserter category per category,
	 * once all the categories are rendered, we start rendering the collections and the uncategorized block types.
	 */
	const currentlyRenderedCategories = useAsyncList( categories );
	const didRenderAllCategories =
		categories.length === currentlyRenderedCategories.length;

	// Async List requires an array.
	const collectionEntries = useMemo( () => {
		return Object.entries( collections );
	}, [ collections ] );
	const currentlyRenderedCollections = useAsyncList(
		didRenderAllCategories ? collectionEntries : EMPTY_ARRAY
	);

	if ( ! items.length ) {
		return <InserterNoResults />;
	}

	const availableCategories = categories.filter( ( category ) => {
		const categoryItems = itemsPerCategory[ category.slug ];
		if ( ! categoryItems || ! categoryItems.length ) {
			return false;
		}
		return category;
	} );

	return (
		<InserterListbox>
			<div ref={ ref }>
				{ showMostUsedBlocks && !! suggestedItems.length && (
					<InserterPanel title={ _x( 'Most used', 'blocks' ) }>
						<BlockTypesList
							items={ suggestedItems }
							onSelect={ onSelectItem }
							onHover={ onHover }
							label={ _x( 'Most used', 'blocks' ) }
						/>
					</InserterPanel>
				) }

				{ currentlyRenderedCategories.map( ( category ) => {
					const categoryItems = itemsPerCategory[ category.slug ];
					if ( ! categoryItems || ! categoryItems.length ) {
						return null;
					}
					return (
						<InserterPanel
							key={ category.slug }
							title={ category.title }
							icon={ category.icon }
						>
							<BlockTypesList
								items={ categoryItems }
								onSelect={ onSelectItem }
								onHover={ onHover }
								label={ category.title }
							/>
						</InserterPanel>
					);
				} ) }

				{ didRenderAllCategories && uncategorizedItems.length > 0 && (
					<InserterPanel
						className="block-editor-inserter__uncategorized-blocks-panel"
						title={ __( 'Uncategorized' ) }
					>
						<BlockTypesList
							items={ uncategorizedItems }
							onSelect={ onSelectItem }
							onHover={ onHover }
							label={ __( 'Uncategorized' ) }
						/>
					</InserterPanel>
				) }

				{ currentlyRenderedCollections.map(
					( [ namespace, collection ] ) => {
						const collectionItems = itemsPerCollection[ namespace ];
						if ( ! collectionItems || ! collectionItems.length ) {
							return null;
						}

						return (
							<InserterPanel
								key={ namespace }
								title={ collection.title }
								icon={ collection.icon }
							>
								<BlockTypesList
									items={ collectionItems }
									onSelect={ onSelectItem }
									onHover={ onHover }
									label={ collection.title }
								/>
							</InserterPanel>
						);
					}
				) }

				{ ( items.length === 0 ||
					availableCategories.length === 1 ) && (
					<div className="block-editor-inserter__tips">
						<InserterPanel title={ _x( 'All blocks', 'blocks' ) }>
							<BlockTypesList
								items={ allItems }
								onSelect={ onSelectGeneralItem }
								onHover={ onHover }
								label={ _x( 'All blocks', 'blocks' ) }
							/>
						</InserterPanel>
					</div>
				) }
			</div>
		</InserterListbox>
	);
}

export default forwardRef( BlockTypesTab );
