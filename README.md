unsplash-wallpaper
==================

> Use an image from unsplash.com (through unsplash.it) as your background image from a simple command.

This downloads a temporary image from unsplash.it using the dimensions you set in the config.

*Tested on Mac and Windows. (should work on Linux).*

**Mac users:** If you install this globally, every action that changes the config.json file will require `sudo`. Follow these [instructions](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md) to not require `sudo`.

Install
-------

```
$ npm install --global unsplash-wallpaper
```

Usage
-----

```
$ unsplash-wallpaper --help

latest

    Get the latest image.
    example:
    $ unsplash-wallpaper latest

random

    Get a random image.
    example:
    $ unsplash-wallpaper random

--width {Number}

    Set the width of desired download. Value is saved.
    example:
    $ unsplash-wallpaper random --width 1600

--height {Number}

    Set the height of desired download. Value is saved.
    example:
    $ unsplash-wallpaper random --width 1600 --height 1200

--dir {String} or "."

    Download the image to a specific directory. Value is saved.
    "." uses the current working directory.
    "./" stores the current working directory even when it changes.
    example:
    $ unsplash-wallpaper --destination "/Users/Shared"
    $ unsplash-wallpaper --destination "C:\Users\Public"
    $ unsplash-wallpaper --destination .

--image {Number}

    Get a specific unsplash image if you know the number.
    (https://unsplash.it/images)
    example:
    $ unsplash-wallpaper --image 580
    $ unsplash-wallpaper --image 566

--gravity "north|east|south|west|center"

    Choose the direction to crop.
    example:
    $ unsplash-wallpaper --image 327 --gravity south

-g

    Apply a grayscale filter.
    example:
    $ unsplash-wallpaper random -g

-b

    Blur the image.
    example:
    $ unsplash-wallpaper random -gb

-v, --version

    Print the version.
    example:
    $ unsplash-wallpaper -v

```

Thanks
------

This program wouldn't be possible without

* https://unsplash.com/
* https://unsplash.it/
* https://github.com/sindresorhus/wallpaper
