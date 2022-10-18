/**
 * External dependencies
 */
import { FastAverageColor } from 'fast-average-color';
import { colord } from 'colord';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * Performs a Porter Duff composite source over operation on two rgba colors.
 *
 * @see https://www.w3.org/TR/compositing-1/#porterduffcompositingoperators_srcover
 *
 * @param {import('colord').RgbaColor} source Source color.
 * @param {import('colord').RgbaColor} dest Destination color.
 * @return {import('colord').RgbaColor} Composite color.
 */
function compositeSourceOver( source, dest ) {
	return {
		r: source.r * source.a + dest.r * dest.a * ( 1 - source.a ),
		g: source.g * source.a + dest.g * dest.a * ( 1 - source.a ),
		b: source.b * source.a + dest.b * dest.a * ( 1 - source.a ),
		a: source.a + dest.a * ( 1 - source.a ),
	};
}

function retrieveFastAverageColor() {
	if ( ! retrieveFastAverageColor.fastAverageColor ) {
		retrieveFastAverageColor.fastAverageColor = new FastAverageColor();
	}
	return retrieveFastAverageColor.fastAverageColor;
}

/**
 * useCoverIsDark is a hook that returns a boolean variable specifying if the cover
 * background is dark or not.
 *
 * @param {?string} url          Url of the media background.
 * @param {?number} dimRatio     Transparency of the overlay color. If an image and
 *                               color are set, dimRatio is used to decide what is used
 *                               for background darkness checking purposes.
 * @param {?string} overlayColor String containing the overlay color value if one exists.
 *
 * @return {boolean} True if the cover background is considered "dark" and false otherwise.
 */
export default function useCoverIsDark(
	url,
	dimRatio = 50,
	overlayColor = '#000'
) {
	const [ isDark, setIsDark ] = useState( false );
	useEffect( () => {
		const overlay = colord( overlayColor )
			.alpha( dimRatio / 100 )
			.toRgb();
		if ( url ) {
			const imgCrossOrigin = applyFilters(
				'media.crossOrigin',
				undefined,
				url
			);
			retrieveFastAverageColor()
				.getColorAsync( url, {
					// Previously the default color was white, but that changed
					// in v6.0.0 so it has to be manually set now.
					defaultColor: [ 255, 255, 255, 255 ],
					// Errors that come up don't reject the promise, so error
					// logging has to be silenced with this option.
					silent: process.env.NODE_ENV === 'production',
					crossOrigin: imgCrossOrigin,
				} )
				.then( ( { value: [ r, g, b, a ] } ) => {
					// FAC uses 0-255 for alpha, but colord expects 0-1.
					const media = { r, g, b, a: a / 255 };
					const composite = compositeSourceOver( overlay, media );
					setIsDark( colord( composite ).isDark() );
				} );
		} else {
			// Assume a white background because it isn't easy to get the actual
			// parent background color.
			const background = { r: 255, g: 255, b: 255, a: 1 };
			const composite = compositeSourceOver( overlay, background );
			setIsDark( colord( composite ).isDark() );
		}
	}, [ overlayColor, dimRatio, url, setIsDark ] );
	return isDark;
}
