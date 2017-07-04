module.exports = `
  random
    Get a random image.
    $ unsplash-wallpaper random

  daily
    Get a fixed daily image.
    $ unsplash-wallpaper daily --user erondu

  weekly
    Get a fixed weekly image.
    $ unsplash-wallpaper weekly --search water

  featured
    Limit the results to the curated collections.
    $ unsplash-wallpaper featured --search montreal

  -w, --width {Number}
    Set the width of desired image.
    $ unsplash-wallpaper --width 2880 --save-config

  -h, --height {Number}
    Set the height of desired image.
    $ unsplash-wallpaper --width 2880 --height 1800 --save-config

  -d, --dir {String} or "."
    Download the image to a specific directory.
    "." uses the current working directory.
    "./" stores the current working directory even when it changes.
    $ unsplash-wallpaper --dir "/Users/Shared"
    $ unsplash-wallpaper --dir "C:UsersPublic"
    $ unsplash-wallpaper -d .

  -s, --save-config
    Saves any width, height or dir value in a config file.
    $ unsplash-wallpaper random -s --width 1600 --height 1200
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
`;
