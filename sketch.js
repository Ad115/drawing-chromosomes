/*
Draw chromosomes
================

Draw the chromosome data from the table in the data folder.
For each species, draw the relative size of the chromosomes
centered on the centromere.
 
This script (sketch) uses the p5.js library. The library
exposes a series of globals to ease making graphics. To 
learn more about p5.js, see <p5js.org> and <hello.p5js.org>.

The main structure of a p5 sketch is as follows:

    + The *preload* function is called before anything else to load
      and prepare the environment. The main program is not started until 
      the processes in *preload* are finished.
      
    + The *setup* function is called.
    
    + The *draw* function (if any) is called. It represents a continuous drawing loop.
      It is required to draw non-static images.

In the present sketch, the chromosomes are drawn in the *setup* function 
and they are not animated, so a *draw* loop is not needed.
*/

var table;



// ---> Main functions <---

function preload() { /*
    File I/O is asynchronous, so it must be in the
    preload function to ensure data has been read
    before it is used.
    */
  table = loadTable('data/centromeric-regions.tsv', 'tsv', 'header');
}


function setup() {/*
    Drawing environment setup.
    */
    
    let data = loadChromosomesData(table);
    
    // Create and prepare drawing canvas.
    createCanvas(windowWidth, 4000);
    
    background(220);
    
    var y = 0;
    for (var species in data){
        // --- Draw the species name
        y += 50;
        textAlign(CENTER, BOTTOM);
        textSize(32);
        text(species, width/2, y);
        
        // --- Draw the chromosomes
        y += 10;
        
        // Calculate scaling factor.
        var maxSide = data[species]
                        .map(getLongestSide)
                        .reduce( (a, b) => Math.max(a, b) );
        var margin = 50;
        var scale = (width/2-margin) / maxSide;
        
        // Draw the chromosomes and the chromosome name
        for(var i=0; i < data[species].length; i++) {
            chromosome = data[species][i];
            
            textAlign(LEFT, CENTER);
            textSize(20);
            text(chromosome.name, 20, y);
            drawChromosome(chromosome, width/2, y, scale);
            y += 30
        }        
    }
}


// ---> Extra functions <---

function drawChromosome(chromosome, x, y, scale) { /* 
    Draw a chromosome centered on the centromere 
    at coordinates x,y scaled by a factor.
    */
    
    if (!scale)
      scale = 1; // Scale is optional argument
    let length = scale * chromosome.length
    let centromere = scale * (chromosome.centromere 
                                ? chromosome.centromere
                                : length/2);
    // Constants
    let centromereRadius = 18;
    let chromosomeWidth = 17;

    push(); // Prepare for a coordinates change
        translate(x, y); // Coordinates relative to the point x,y

        // Draw chromosome sides
        stroke(150);
        strokeWeight(chromosomeWidth);
        line(-centromere, 0, length-centromere, 0);

        // Draw centromere
        if (chromosome.centromere) {
            noStroke();
            fill(100);
            ellipse(0, 0, centromereRadius, centromereRadius);
        }
    pop(); // Restore previous coordinates
}


function loadChromosomesData(table) { /*
    Load the data in the given table into an object 
    with the following schema:
    
         SPECIES        CHROMOSOME DATA
         -------        ---------------
    
    { 'Homo sapiens' : [ { 'name': 'I',
                           'length': XXXX,
                           'centromere': XXXX },
                         { ... },
                         { ... },
                        
                         ... 
                         { 'name': 'XIV',
                           'length': XXXX,
                           'centromere': XXXX },],
                        
      'Mus musculus' : [ ... ],
      ...
      'Gallus gallus': [ ... ] }
    
    */
    var data = {};
    for (var r = 0; r < table.getRowCount(); r++) {
        
        let row = table.getRow(r);
        
        // --- Fetch species data
        let species = row.getString('species');
        if (!data[species])
            data[species] = []; // Create species list if doesn't already exists
        
        // --- Fetch chromosome data
        chromosome = {};
        
        // Chromosome name
        chromosome.name = row.getString('chromosome');
        
        // Chromosome length
        chromosome.length = Number(row.getString('chromosome length (bp)'));
        
        // Centromere position
        let cenStart = Number(row.getString('centromeric region start'));
        let cenEnd = Number(row.getString('centromeric region end'))
        chromosome.centromere = ( cenStart + cenEnd )/2; // Just in the middle.
        
        data[species].push(chromosome);
    }
    
    return data;
}


function getLongestSide(chromosome) { /*
    From a chromosome object:
    c = { 'name': 'IV',
          'length': XXXX,
          'centromere': XXXX },
    get the longest of `c.centromere` and `c.length - c.centromere`.
    */
    let centromere = chromosome.centromere
    return Math.max(centromere, chromosome.length-centromere);
}
