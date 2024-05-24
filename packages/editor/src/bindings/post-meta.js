/**
 * WordPress dependencies
 */
import { store as coreDataStore } from '@wordpress/core-data';
import { _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { store as editorStore } from '../store';

export default {
	name: 'core/post-meta',
	label: _x( 'Post Meta', 'block bindings source' ),
	getPlaceholder( { args } ) {
		return args.key;
	},
	getValue( { select, context, args } ) {
		return select( coreDataStore ).getEditedEntityRecord(
			'postType',
			context?.postType,
			context?.postId
		).meta?.[ args.key ];
	},
	setValue( { registry, context, args, value } ) {
		const postId =
			context.postId || registry.select( editorStore ).getCurrentPostId();
		const postType =
			context.postType ||
			registry.select( editorStore ).getCurrentPostType();
		registry
			.dispatch( coreDataStore )
			.editEntityRecord( 'postType', postType, postId, {
				meta: {
					[ args.key ]: value,
				},
			} );
	},
	lockAttributesEditing( { select, context = {}, args } ) {
		const postId = context.postId
			? context.postId
			: select( editorStore ).getCurrentPostId();
		const postType = context.postType
			? context.postType
			: select( editorStore ).getCurrentPostType();

		// Check that editing is happening in the post editor and not a template.
		if ( postType === 'wp_template' ) {
			return true;
		}

		// Check that the custom field is not protected and available in the REST API.
		const isFieldExposed =
			select( editorStore ).getEditedPostAttribute( 'meta' )[ args.key ];
		if ( ! isFieldExposed ) {
			return true;
		}

		// Check that the user has the capability to edit post meta.
		const canUserEdit = select( coreDataStore ).canUserEditEntityRecord(
			'postType',
			postType,
			postId
		);
		if ( ! canUserEdit ) {
			return true;
		}

		return false;
	},
};
