const fs             = require('fs');
const make         = process.argv.slice(2)[0];
const name         = process.argv.slice(3)[0];
let maketemplate = false;
switch (make){
    case 'front':
    case 'f':
        out_path = './front-page.php';
        style_out = "<?php" + "\n";
        maketemplate = true;
        break;
    case 's':
    case 'single':
        out_path = './single-'+name+'.php';
        style_out = "<?php" + "\n" ;
        maketemplate = true;
        break;
    case 'templ':
    case 't':
    case 'template':
        var templatefile = "template-" + name;
        var templatename = name.replace(new RegExp('-'),' ');
        templatename     = templatename.charAt(0).toUpperCase() + templatename.slice(1);
        out_path = './' + templatefile + '.php';
        style_out = "<?php" + "\n" +
            "/* Template Name: "+templatename+" template */" + "\n" ;
        maketemplate = true;
        break;
}
if(maketemplate == true){
    style_out += "get_header();" + "\n" +
        "while ( have_posts() ) : the_post(); ?>" + "\n" +"\n" +
        "<?php endwhile;" + "\n" +
        "get_footer(); ?>";
    fs.writeFile(out_path, style_out, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}