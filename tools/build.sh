#!/bin/bash

files="\
    src/wrap/header.txt\
    src/init.js\
    src/lib/class.js\
    src/lib/notify.js\
    src/app.js\
    src/config.js\
    src/screen.js\
    src/view/view.js\
    src/view/text.js\
    src/view/image.js\
    src/view_group/view_group.js\
    src/root.js\
    src/scene.js\
    src/page.js\
    src/resource_manager.js\
    src/transition/*.js\
    src/wrap/footer.txt\
    "

rm -f build/navy.js build/navy.min.js
for file in $files
do
    cat $file >> build/navy.js
done

uglifyjs build/navy.js --mangle --reserved '$super' --output build/navy.min.js
