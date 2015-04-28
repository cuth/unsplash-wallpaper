unsplash-wallpaper
==================

Use an image from unsplash.com (through unsplash.it) as your background image from a simple command.

Install
-------

```
$ npm install --global unsplash-wallpaper
```

Usage
-----

```
$ unsplash-wallpaper --help
  
    --config {Width}x{Height}

        Save the image dimensions for your wallpaper.
        example:
        $ unsplash-wallpaper --config 1600x1200

    keywords {random|blur}

        Get a random image or make the image blurry.
        (Note: these should be the first parameters)
        example:
        $ unsplash-wallpaper random

    --image {Number}

        Get a specific unsplash image if you know the number.
        (https://unsplash.it/images)
        example:
        $ unsplash-wallpaper --image 580
        $ unsplash-wallpaper blur --image 566

    --gravity {north|east|south|west|center}

        Choose the direction to crop.
        example:
        $ unsplash-wallpaper --image 327 --gravity south

    -g

        Apply a grayscale filter.
        example:
        $ unsplash-wallpaper random -g

```

Thanks
------

This program wouldn't be possible without

* https://unsplash.com/
* https://unsplash.it/
* https://github.com/sindresorhus/wallpaper
