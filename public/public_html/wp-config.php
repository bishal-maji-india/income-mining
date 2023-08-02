<?php

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u379003300_U2nTr' );

/** Database username */
define( 'DB_USER', 'u379003300_tk7ao' );

/** Database password */
define( 'DB_PASSWORD', 'oZxa2buIKl' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'tlm!r@f(y-Ht!$04#DAt!N UfT]q&RAv3q-kY*qRJ4HE^Zz}lm>?3.GRB}8><:@{' );
define( 'SECURE_AUTH_KEY',   '49ZH~*@NJ>(`+:Rj~)NrykhnR+oa!a>P6gA/e]afX+BA5(rT]alD,Y3j32>lsi8b' );
define( 'LOGGED_IN_KEY',     '3Z.W+88!l%l[>biAAv(p`ovDSqnd%QEBEnh?e @jGO;.tI~]l(]ezQTbXs<}ef6?' );
define( 'NONCE_KEY',         'Kt2wIqHT][}j7~=p#gjkgcZbj5zfI8JB;7u/9T zbC3I6?PClj@v!rRJsdw)MPIt' );
define( 'AUTH_SALT',         'lUdS{sto;]Wk$=y(*ebO8qh5Un6DtzFGpgE=2|!f2*O;u,8p$=8Y2IG?ZE&7,hG=' );
define( 'SECURE_AUTH_SALT',  'G=C@_R]*Ec>ks3!xUU^LUVJ;*e_V<M6iSxLq,w=:)8hu25B-q8h|Iz ^aA=s*[Nc' );
define( 'LOGGED_IN_SALT',    '9K~B?F{U~:.-Fp#t*IIibd&S31%|y9371pxGW4rW_oTA-!:jI p>sKsVrS|Ue72w' );
define( 'NONCE_SALT',        '!8m |JN3n1X][EgyM~/jd8vl9_3Z%ndf5.&lyISjfpP ;0InIQfL{x/IlBBe4T?H' );
define( 'WP_CACHE_KEY_SALT', 'tQ1OJ1#,3?j[}u74chGiAAM spcKn$>Qd*J:#Z2;V~^atf(B6>28j^ob8QG.g<fc' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );


/* Add any custom values between this line and the "stop editing" line. */



define( 'FS_METHOD', 'direct' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
