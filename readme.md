# Replication Graph

Generates graphs of Cloudant replications, using [grunt](http://gruntjs.com/) and [d3](http://d3js.org/).

## Cool! How?

First, let's get our dependencies:

    git clone git@github.com:garbados/replication-graphs.git
    cd replication-graphs
    npm install

Then, call `grunt init` and answer its questions. It'll construct a config.js using your answers.

Ok, finally, let's rock:

    grunt --target=you,me,everyone,we,know

The default task takes a comma-separated list of Cloudant usernames and deploys some attachments to a document named after the users you scanned. In the example, it would deploy here:

    https://USERNAME.cloudant.com/DATABASE/you-me-everyone-we-know/index.html

Neat, huh?

## License

[MIT](http://opensource.org/licenses/MIT)