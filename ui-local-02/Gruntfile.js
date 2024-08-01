
/*global module */

module.exports = function (grunt) {
    'use strict';
    grunt.config.merge({
        clean: {
            ui: ["webapp/ui"]
        },
        copy: {
            product: {
                expand: true,
                cwd: "../specmgmt/app/ui-specification/webapp/",
                src: "**",
                dest: "webapp/ui/ui-specification"
            },
            loadvaluesets: {
                expand: true,
                cwd: "../specmgmt/app/ui-loadvaluesets/webapp/",
                src: "**",
                dest: "webapp/ui/ui-loadvaluesets"
            },
            datasetting: {
                expand: true,
                cwd: "../specmgmt/app/ui-datasetting/webapp/",
                src: "**",
                dest: "webapp/ui/ui-datasetting"
            },
            configure: {
                expand: true,
                cwd: "../specmgmt/app/ui-configuration/webapp/",
                src: "**",
                dest: "webapp/ui/ui-configuration"
            },
            propertytree: {
                expand: true,
                cwd: "../specmgmt/app/ui-propertytree/webapp/",
                src: "**",
                dest: "webapp/ui/ui-propertytree"
            },
            maintain: {
                expand: true,
                cwd: "../specmgmt/app/ui-specificationtype/webapp/",
                src: "**",
                dest: "webapp/ui/ui-specificationtype"
            },
            definephrase: {
                expand: true,
                cwd: "../specmgmt/app/ui-maintainphrase/webapp/",
                src: "**",
                dest: "webapp/ui/ui-maintainphrase"
            },
            property: {
                expand: true,
                cwd: "../specmgmt/app/ui-property/webapp/",
                src: "**",
                dest: "webapp/ui/ui-property"
            },
            specification: {
                expand: true,
                cwd: "../specmgmt/app/ui-maintainspecification/webapp/",
                src: "**",
                dest: "webapp/ui/ui-maintainspecification"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('collectUI', ['clean:ui', 'copy']);
};