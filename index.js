#! /usr/bin/env node

'use strict';

var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

// --help
if (argv.hasOwnProperty('help')) {
    console.log([
        '    --config {Width}x{Height}',
        '',
        '        Save the image dimensions for your wallpaper.',
        '        example:',
        '        $ unsplash-wallpaper --config 1600x1200',
        '',
        '    keywords {random|blur}',
        '',
        '        Get a random image or make the image blurry.',
        '        (Note: these should be the first parameters)',
        '        example:',
        '        $ unsplash-wallpaper random',
        '',
        '    --image {Number}',
        '',
        '        Get a specific unsplash image if you know the number.',
        '        (https://unsplash.it/images)',
        '        example:',
        '        $ unsplash-wallpaper --image 580',
        '        $ unsplash-wallpaper blur --image 566',
        '',
        '    --gravity {north|east|south|west|center}',
        '',
        '        Choose the direction to crop.',
        '        example:',
        '        $ unsplash-wallpaper --image 327 --gravity south',
        '',
        '    -g',
        '',
        '        Apply a grayscale filter.',
        '        example:',
        '        $ unsplash-wallpaper random -g'
    ].join('\n'));
    return;
}

// --config {width}x{height}
if (argv.hasOwnProperty('config')) {
    saveConfig(argv.config);
    return;
}

// read config
fs.readFile(__dirname + '/config.json', "utf-8", function (err, data) {
    if (err) {
        configError();
        return;
    }

    var config = JSON.parse(data);

    if (typeof config.width !== 'number' || typeof config.height !== 'number') {
        configError();
        return;
    }

    downloadImage(config);
});


function downloadImage(config) {

    var request = require('got');
    var progress = require('request-progress');
    var wallpaper = require('wallpaper');

    var url = 'https://unsplash.it/';
    var hasQuestionMark = false;

    // grayscale
    // -g
    if (argv.g) {
        url += 'g/';
    }

    url += config.width + '/' + config.height + '/';

    // image number
    // --image #
    if (typeof argv.image === 'number') {
        url += '?image=' + argv.image;
        hasQuestionMark = true;
    }

    // gravity
    // --gravity north, east, south, west, center
    if (argv.gravity) {
        url += (hasQuestionMark) ? '&' : '?';
        url += 'gravity=' + argv.gravity;
        hasQuestionMark = true;
    }

    // params
    // random blur
    if (argv._.length > 0) {
        url += (hasQuestionMark) ? '&' : '?';
        url += argv._.join('&');
    }

    console.log('request ', url);

    progress(request(url))
    .on('progress', function (state) {
        console.log(state.percent + '%');
    })
    .on('error', function (err) {
        console.log('An error as occured while downloading.', err);
    })
    .pipe(fs.createWriteStream(__dirname + '/wallpaper.jpg'))
    .on('error', function (err) {
        console.log('An error as occured while streaming.', err);
    })
    .on('close', function () {

        wallpaper.set(__dirname + '/wallpaper.jpg', function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('done');
        });
    });
}

function saveConfig(dim) {
    if (typeof dim !== 'string') {
        configError();
        return;
    }
    
    dim = dim.split('x');

    var config = {
        width: parseInt(dim[0], 10),
        height: parseInt(dim[1], 10)
    };

    fs.writeFileSync(__dirname + '/config.json', new Buffer(JSON.stringify(config, null, 4)), 'utf-8');
}

function configError() {
    console.log([
        'Please create a config file.',
        '',
        '--config {width}x{height}',
        '',
        'example:',
        '$ unsplash-wallpaper --config 1600x1200'
    ].join('\n'));
}
