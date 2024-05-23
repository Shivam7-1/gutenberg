<?php
/**
 * Gutenberg Coding Standard.
 *
 * Bootstrap file for running the tests.
 *
 * - Load the PHPCS PHPUnit bootstrap file providing cross-version PHPUnit support.
 *   {@link https://github.com/squizlabs/PHP_CodeSniffer/pull/1384}
 * - Load the Composer autoload file.
 * - Automatically limit the testing to the Gutenberg coding standard tests.
 *
 * @package gutenberg/gutenberg-coding-standards
 * @link    https://github.com/WordPress/gutenberg
 * @license https://opensource.org/licenses/MIT MIT
 */

if ( ! defined( 'PHP_CODESNIFFER_IN_TESTS' ) ) {
	define( 'PHP_CODESNIFFER_IN_TESTS', true );
}

$ds = DIRECTORY_SEPARATOR;

/*
 * Load the necessary PHPCS files.
 */
// Get the PHPCS dir from an environment variable.
$phpcs_dir = dirname( __DIR__ ) . $ds . 'vendor' . $ds . 'squizlabs' . $ds . 'php_codesniffer';

// Try and load the PHPCS autoloader.
if ( ! file_exists( $phpcs_dir . $ds . 'autoload.php' ) || ! file_exists( $phpcs_dir . $ds . 'tests' . $ds . 'bootstrap.php' ) ) {
	echo 'Can\'t find PHP_CodeSniffer. Run "composer install".' . PHP_EOL;
	die( 1 );
}

require_once $phpcs_dir . $ds . 'autoload.php';
require_once $phpcs_dir . $ds . 'tests' . $ds . 'bootstrap.php'; // PHPUnit 6.x+ support.

/*
 * Set the PHPCS_IGNORE_TEST environment variable to ignore tests from other standards.
 */
$all_coding_standards   = PHP_CodeSniffer\Util\Standards::getInstalledStandards();

$standards_to_ignore = array( 'Generic' );
foreach ( $all_coding_standards as $coding_standard ) {
	if ( 'Gutenberg' === $coding_standard ) {
		continue;
	}

	$standards_to_ignore[] = $coding_standard;
}

$standards_to_ignore_as_string = implode( ',', $standards_to_ignore );

// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.runtime_configuration_putenv -- This is not production code.
putenv( "PHPCS_IGNORE_TESTS={$standards_to_ignore_as_string}" );

// Clean up.
unset( $ds, $phpcs_dir, $all_coding_standards, $standards_to_ignore, $coding_standard, $standards_to_ignore_as_string );
