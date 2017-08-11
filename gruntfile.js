module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		express: {
			dev: {
				options: {
					port: 9000,
					script: 'server.js',
					livereload: true
				}
			}
		},

		uglify: {
			options: {
				mangle: true,
				compress: {
					drop_console: true
				},
				beautify: false
			},
			my_target: {
				/*
				// minify and join
				files: [{
					src: 'src/js/*.js',
				    dest: 'dist/js/scripts.min.js'
				}] 
				*/
				
				// minify only (use concat module to join file)
				files: [{
					expand: true,
					cwd: 'src/js',
					src: '*.js',
					dest: 'dist/js',
					ext: '.min.js'
				}]
				
			}
		},

		sass: {
			dist: {
				files: {
					'dist/css/style.css': 'src/sass/main.scss'
				}
			}
		},

		autoprefixer:{
			dist:{
				files:{
					'dist/css/style.css':'dist/css/style.css'
				}
			}
		},

		cssmin: {
			my_target: {
				files: [{
					expand: true, 
					cwd: 'dist/css',
					src: ['*.css', '!*.min.css'],  // "!*" is to exclude those files
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		},

		watch: {
			express: {
				files:  [
				  '<%= express.dev.options.script %>'
				],
				tasks:  [ 'express:dev' ],
				options: {
				  spawn: false
				}
			},
			sass: {
				files: ['src/sass/*.scss'],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			},
			uglify: {
				files: ['src/js/*.js'],
				tasks: ['uglify']
			},
			livereload: {
				options: { livereload: true },
				files: ['dist/**/*']
			},
		},

		// grunt-open will open your browser at the project's URL
	    open: {
			dev: {
				// Gets the port from the connect configuration
				path: 'http://localhost:<%= express.dev.options.port%>'
			}
		}




	});


	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-open');


	grunt.registerTask('compileCSS', ['sass', 'autoprefixer', 'cssmin'] );
	grunt.registerTask('compileJS', ['uglify'] );
	grunt.registerTask('compile', ['compileCSS', 'compileJS'] );
	grunt.registerTask('server', ['express:dev', 'open', 'watch'] );

	grunt.registerTask('default', ['compile', 'server'] );
}