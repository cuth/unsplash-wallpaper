unsplash-wallpaper
==================

> Use an image from unsplash.com as your background image from a simple command.

![Koala search screenshot](/screenshot-koala.jpg?raw)

This downloads an image from `source.unsplash.com` and assigns it as the background image for the active main screen.

*Tested on Mac and Windows. (should work on Linux).*

Install
-------

```
# NPM
$ npm install --global unsplash-wallpaper

# Yarn
$ yarn global add unsplash-wallpaper
```


Usage
-----

```
$ unsplash-wallpaper --help

  -r, --random 
    Get a random image.
    $ unsplash-wallpaper --random

  -a, --daily 
    Get a fixed daily image.
    $ unsplash-wallpaper --user erondu --daily

  -e, --weekly 
    Get a fixed weekly image.
    $ unsplash-wallpaper --search water --weekly

  -f, --featured 
    Limit the results to the curated collections.
    $ unsplash-wallpaper -f --search montreal

  -w, --width {Number}
    Set the width of desired image.
    $ unsplash-wallpaper --width 2880 --save-config

  -h, --height {Number}
    Set the height of desired image.
    $ unsplash-wallpaper --width 2880 --height 1800 --save-config

  -d, --dir {String}
    Download the image to a specific directory.
    "." uses the current working directory.
    "./" stores the current working directory even when it changes.
    $ unsplash-wallpaper --dir "/Users/Shared
    $ unsplash-wallpaper --dir "C:UsersPublic
    $ unsplash-wallpaper -d .

  -s, --save-config 
    Saves any width, height or dir value in a config file.
    $ unsplash-wallpaper -s --width 1600 --height 1200
    Leave the values blank to reset width and height:
    $ unsplash-wallpaper -whs

  -p, --photo {PHOTO ID}
    Get a specific image by the photo ID.
    $ unsplash-wallpaper -p WLUHO9A_xik
    $ unsplash-wallpaper --photo="-oWyJoSqBRM"

  -c, --category {CATEGORY NAME}
    Get a photo in a category.
    $ unsplash-wallpaper --category nature

  -u, --user {USERNAME}
    Get a photo from a specific user.
    $ unsplash-wallpaper -u erondu

  -l, --likes {USERNAME}
    Get a photo liked by a user.
    $ unsplash-wallpaper --likes jackie

  -o, --collection {COLLECTION ID}
    Get a photo apart of a specific collection.
    $ unsplash-wallpaper --collection 190727

  -q, --search {KEYWORD,KEYWORD}
    Get a photo from a search query.
    $ unsplash-wallpaper -q nature,water
    $ unsplash-wallpaper -q="water falls"

  -v, --version 

  --help 

```


Thanks
------

This program wouldn't be possible without

* https://unsplash.com/
* https://github.com/sindresorhus/wallpaper
