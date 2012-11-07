#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const path   = require('path'),
      fs     = require('fs'),
      test_root_path = path.join(__dirname, "..", "tests"),
      tests_to_ignore = require('../config/tests-to-ignore').tests_to_ignore,
      glob   = require('minimatch');

exports.find = function(root, tests, pattern) {
  root = root || test_root_path;
  tests = tests || [];
  pattern = pattern || "*";

  try {
    var files = fs.readdirSync(root);
    files.forEach(function(file) {
      var filePath = path.join(root, file);
      var stats = fs.lstatSync(filePath);
      if (stats.isFile()) {
        if (/\.js$/.test(file)) {
          if (tests_to_ignore.indexOf(file) === -1) {
            if (glob(file, pattern)) {
              tests.push({
                name: file.replace('.js', ''),
                path: filePath
              });
            }
          }
          else {
            console.log("ignoring", file);
          }
        }
      }
      else if (stats.isDirectory()) {
        exports.find(filePath, tests, pattern);
      }

    });
  } catch(e) {
    console.log(e.toString());
    return;
  }

  return tests;
};