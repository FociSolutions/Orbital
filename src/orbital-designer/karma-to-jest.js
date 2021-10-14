var fs = require('fs');
var filename = process.argv[2];

if (!filename) {
  let specs = require('glob').sync('src/**/*.spec.ts');
  for (spec of specs) {
    if (!spec.includes('pact')) {
      convertToJest(spec);
    }
  }
} else {
  convertToJest(filename);
}

function convertToJest(filename) {
  if (!filename.startsWith('C:')) {
    filename = './' + filename;
  }

  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data;
    result = result.replace(" } from '@ngneat/spectator';", ", SpyObject } from '@ngneat/spectator/jest';");
    result = result.replace("} from '@ngneat/spectator';", ", SpyObject } from '@ngneat/spectator/jest';");
    result = result.replace(/SpyObj</g, 'SpyObject<');
    result = result.replace(/\.and\.returnValue/g, '.mockReturnValue');
    result = result.replace(/\.spec\'/g, '.test');
    result = result.replace(/jasmine\.SpyObj/g, 'SpyObj');
    result = result.replace(/jasmine\.createSpy/g, 'createSpy');
    result = result.replace(/spyOn/g, 'jest.spyOn');
    result = result.replace(/spyOnProperty/g, 'spyOn');
    result = result.replace(
      /expect\((.*)\.calls\.first\(\)\.args\)\.toEqual\(\[(.*)\]\);/g,
      'expect($1).toHaveBeenCalledWith($2);'
    );
    result = result.replace(/expect\((.*)\.calls\.any\(\)\)\.toBe\((.*)\);/g, 'expect($1).toHaveBeenCalledWith($2);');
    result = result.replace(
      /expect\((.*)\.calls\.mostRecent\(\)(\.args\[.*\])?\)\.toEqual\((.*)\);/g,
      'expect($1).toHaveBeenCalledWith($2);'
    );
    result = result.replace(
      /expect\((.*)\.calls\.count\(\)\)\.toBe\((.*)\);/g,
      'expect($1).toHaveBeenCalledTimes($2);'
    );
    result = result.replace(
      /expect\((.*)\.calls\.count\(\)\)\.toEqual\((.*)\);/g,
      'expect($1).toHaveBeenCalledTimes($2);'
    );
    result = result.replace(/\.calls\.first\(\).args/g, '.mock.calls[0].args');
    result = result.replace(/and.callFake/g, 'mockImplementation');
    // result = result.replace(/createService\(/g, 'createServiceFactory(');
    // result = result.replace(/createService,/g, 'createServiceFactory,');

    if (result.includes('createSpyObj')) {
      result = result.replace(/jasmine\.createSpyObj/g, 'createSpyObj');
      result = result.replace(/createSpyObject/g, 'createSpyObj');

      var numberOfSlashesinFilename = (filename.replace('./src/app/', '').match(/\//g) || []).length;
      var prefix = './';
      for (var i = 0; i < numberOfSlashesinFilename; i++) {
        prefix += '../';
      }

      result = "import { createSpyObj } from '" + prefix + "shared/testing/SpyObj';\r\n" + result;
    }

    result = result.replace('import SpyObj = SpyObj;', '');
    result = result.replace('import Spy = jasmine.Spy;', '');
    result = result.replace('import createSpyObj = createSpyObj;', '');
    result = result.replace(/ Spy;/g, ' jest.SpyInstance;');
    result = result.replace(/jasmine\.Spy;/g, 'jest.SpyInstance;');

    if (!result.includes('@ngneat/spectator') && result.includes('SpyObject')) {
      result = "import { SpyObject } from '@ngneat/spectator/jest';\r\n" + result;
    }
    if (result.includes('MatDialog') && !result.includes('@angular/material/dialog')) {
      result = result.replace(/import \{(.*)MatDialog, (.*)\}/g, 'import {$1$2}');
      result = result.replace(/import \{(.*)MatDialogModule, (.*)\}/g, 'import {$1$2}');
      result = result.replace(/import \{(.*)MatDialogModule(.*)\}/g, 'import {$1$2}');
      result = result.replace(/import \{(.*)MAT_DIALOG_DATA, (.*)\}/g, 'import {$1$2}');
      result = result.replace(/import \{(.*)MatDialogRef, (.*)\}/g, 'import {$1$2}');
      result =
        "import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';\r\n" +
        result;
    }

    if (result.includes('withArgs')) {
      result = result.replace(
        /(.*)\.withArgs\((.*)\)\.mockReturnValue\((.*)\)/g,
        `$1.mockImplementation(flag => {
        switch (flag) {
          case $2:
            return $3;
        }
      })`
      );
    }

    result = result.replace(/jest\.jest/g, 'jest');

    fs.writeFile(filename, result, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log('Successfully wrote ' + filename);
    });
  });
}
