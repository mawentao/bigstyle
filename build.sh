#!/bin/bash

####################################################
# @file:   build.sh
# @author: mawentao(mawt@youzu.com)
# @create: 2015-08-28 14:55:12
# @modify: 2015-08-28 14:55:12
# @brief:  build.sh
####################################################

template_name="bigstyle"
outdir="output/$template_name"
tarname="$template_name.zip"
src="dist-"`date +%s`

function cpfiles()
{
    for i in $@; do
        cp -r $i $outdir
    done
}

################################
rm -rf output
mkdir -p $outdir
# 压缩混淆js代码
node r.js -o build.js
rm -rf touch/static/dist/er
rm -rf touch/static/dist/build.txt
# copy files
cpfiles touch *.xml preview.jpg preview_large.jpg
# 删除js源码
rm -rf $outdir/touch/static/src
rm -rf $outdir/touch/*.bk
rm -rf $outdir/touch/member/*.bk
rm -rf $outdir/touch/static/libs/mwt/update.sh
# dist rename
mv $outdir/touch/static/dist $outdir/touch/static/$src
sed -i "s/src\//$src\//g" $outdir/touch/common/mwt_frame.htm
sed -i "s/dist\//$src\//g" $outdir/touch/common/mwt_frame.htm
sed -i "s/src\//$src\//g" $outdir/touch/common/footer.htm
sed -i "s/dist\//$src\//g" $outdir/touch/common/footer.htm
# rm .svn
cd $outdir
find . -type d -name ".svn" | xargs rm -rf
find . -type d -name ".bk" | xargs rm -rf
# zip
cd ../; zip -r $tarname $template_name
cd ../
################################

echo 'build success'
exit 0
