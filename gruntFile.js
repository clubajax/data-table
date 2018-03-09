'use strict';

const path = require('path');
const register = require('@babel/register');

register({
	// ignore: [function(filename) {
	// 	console.log('IGNORE?', filename);
	// 	return false;
	// }],
	ignore: [/node_modules/],
	only: [/@clubajax\/XXXbase-component|@clubajax\/no-dash/],
	// extensions: [".es6", ".es", ".jsx", ".js", ".mjs"],
	cache: true
});

module.exports = function (grunt) {

	function vendorsToBabelize () {
		// not all vendors need to be babelized. Most are already ES5.
		const files = '@clubajax/base-component|@clubajax/no-dash';
		return new RegExp(`^(?:.*\/node_modules\/(?:${files})\/|(?!.*\/node_modules\/)).*$`);
	}



    // collect dependencies from node_modules
    let nm = path.resolve(__dirname, 'node_modules'),
        vendorAliases = ['@clubajax/dom', '@clubajax/on', '@clubajax/custom-elements-polyfill', '@clubajax/base-component'],
		baseAliases = ['./src/data-table.js'],
		allAliases = vendorAliases.concat(baseAliases),
		sourceMaps = true,
        watch = false,
        watchPort = 35750,
		devBabel = true,
		deployBabel = true,
		vTransform = [['babelify', {
			'presets': ['@babel/preset-env'],
			global: true,
			// only: ['@clubajax/base-component', '@clubajax/no-dash'],
			//only: [/@clubajax\/base-component|@clubajax\/no-dash/],
			// ignore: ['node_modules']
		}]],
		transform = [['babelify', { presets: ['@babel/preset-env'] }]],
		babelTransform = devBabel ? transform : [],
		vendorTransform = devBabel ? vTransform : [],
		deployBabelTransform = deployBabel ? vTransform : [];
    
    grunt.initConfig({
        
        browserify: {
            // source maps have to be inline.
            // grunt-exorcise promises to do this, but it seems overly complicated
            vendor: {
                // different convention than "dev" - this gets the external
                // modules to work properly
                // Note that vendor does not run through babel - not expecting
                // any transforms. If we were, that should either be built into
                // the app or be another vendor-type file
                src: ['.'],
                dest: 'tests/dist/vendor.js',
                options: {
                    // expose the modules
                    alias: vendorAliases.map(function (module) {
                        return module + ':';
                    }),
                    // not consuming any modules
                    external: null,
					transform: vendorTransform,
                    browserifyOptions: {
                        debug: sourceMaps
                    }
                }
            },
            dev: {
                files: {
                    'tests/dist/output.js': ['tests/src/data-table-tests.js']
                },
                options: {
                    // not using browserify-watch; it did not trigger a page reload
                    watch: false,
                    keepAlive: false,
                    external: vendorAliases,
					alias: {
                    	//'BaseComponent': './src/BaseComponent'
					},
                    browserifyOptions: {
                        debug: sourceMaps
                    },
                    // transform not using babel in dev-mode.
                    // if developing in IE or using very new features,
                    // change devBabel to `true`
                    transform: babelTransform,
                    postBundleCB: function (err, src, next) {
                        console.timeEnd('build');
                        next(err, src);
                    }
                }
            },
            deploy: {
                files: {
                    'dist/data-table.js': ['tests/src/data-table-tests.js']
                },
                options: {
					transform: deployBabelTransform,
                    browserifyOptions: {
						standalone: 'data-table',
                        debug: false
                    }
                }
            }
        },

		sass: {
			deploy: {
				options: {
					// case sensitive!
					sourceMap: true
				},
				// 'path/to/result.css': 'path/to/source.scss'
				files: {
					'dist/data-table.css': 'src/data-table.scss'
				}
			},
			dev: {
				options: {
					// case sensitive!
					sourceMap: true
				},
				// 'path/to/result.css': 'path/to/source.scss'
				files: {
					'tests/dist/data-table.css': 'src/data-table.scss'
				}
			}
		},
        
        watch: {
			less: {
				files: ['./src/data-table.scss'],
				tasks: ['sass'],
				options: {
					// keep from refreshing the page
					// the page does not care if a less file has changed
					livereload: false
				}
			},
			// css module is needed for css reload
			// watch the main file. When it changes it will notify the page
			// the livereload.js file will check if this is CSS - and if so, reload
			// the stylesheet, and not the whole page
			css: {
				files: 'tests/dist/data-table.css'
			},
            scripts: {
                files: ['tests/src/*.js', 'src/*.js', 'tests/*.html'],
                tasks: ['build-dev']
            },
            options: {
                livereload: watchPort
            }
        },

        'http-server': {
            main: {
                // where to serve from (root is least confusing)
                root: '.',
                // port (if you run several projects at once these should all be different)
                port: '8200',
                // host (0.0.0.0 is most versatile: it gives localhost, and it works over an Intranet)
                host: '0.0.0.0',
                cache: -1,
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: false
                // route requests to another server:
                //proxy: dev.machine:80
            }
        },

        concurrent: {
            target: {
                tasks: ['watch', 'http-server'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // watch build task
    grunt.registerTask('build-dev', function (which) {
        console.time('build');
		grunt.task.run('sass:dev');
		console.log('\nsource');
        grunt.task.run('browserify:dev');

    });

    // task that builds vendor and dev files during development
    grunt.registerTask('build', function (which) {
		console.log('\nvendor');
        grunt.task.run('browserify:vendor');
        grunt.task.run('build-dev');
    });

    // The general task: builds, serves and watches
    grunt.registerTask('dev', function (which) {
        grunt.task.run('build');
        grunt.task.run('concurrent:target');
    });

    // alias for server
    grunt.registerTask('serve', function (which) {
        grunt.task.run('http-server');
    });

	grunt.registerTask('deploy', function (which) {
		grunt.task.run('browserify:deploy');
		grunt.task.run('sass:deploy');
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-http-server');
};