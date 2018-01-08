/*
Draw chromosomes
================

Example
-------

Species: Homo sapiens
Chromosome: 1
Chromosome size: 248956422
Centromeric region: 122026460-125184587
Reference: GRCh38.p12. (https://www.ncbi.nlm.nih.gov/grc/human/data, https://www.ncbi.nlm.nih.gov/grc/human )
*/
var chromosomeLength = 248956422;
var centromereStart = 122026460;
var centromereEnd = 125184587;

var table;
var data;

function preload() {
  table = loadTable('data/centromeric-regions.tsv', 'tsv', 'header');
}

function setup() {
    
    data = loadChromosomesData(table);
  print(data);
  createCanvas(windowWidth, windowHeight);
  background(220);

  //count the columns
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');

  print(table.columns);
}

function draw() {
  // Calculate scaling
  var left = centromereStart;
  var right = chromosomeLength - centromereEnd;
  var maxSide = Math.max(left, right);
  var margin = 30;
  var scale = (width/2-margin) / maxSide;

  drawChromosome(scale*left, scale*right);
}


function drawChromosome(left, right) {
/* Draw a chromosome.*/
  var centromereWidth = 20;
  var chromosomeWidth = 17;

  // Begin drawing
  translate(width/2, height/2); // Coordinates relative to the center of the screen.

  // Draw chromosome sides
  stroke(150);
  strokeWeight(chromosomeWidth);
  line(-left, 0, right, 0);

  // Draw centromere
  noStroke();
  fill(100);
  ellipse(0, 0, centromereWidth, centromereWidth);


}

function loadChromosomesData(table) { /*
    Load the data in the given table into an object 
    with the following schema:
    
         SPECIES        CHROM    CHROMOSOME DATA
         -------        -----    ----------------
    
    { 'Homo sapiens' : { '1' : { 'length': XXXX,
                                 'centromere': XXXX }
                         '2' : { ... },
                        
                         ...
                        
                         'Y' : { ... } },
                        
      'Mus musculus' : { ... },
      ...
      'Gallus gallus': { ... } }
    
    */
    
     for (var r = 0; r < table.getRowCount(); r++) {
    var row = ''
    for (var c = 0; c < table.getColumnCount(); c++) {
      row += table.getString(r, c) + "\t";
    }
    print(row);
  }
    
    var data = {};
    for (var r = 0; r < table.getRowCount(); r++) {
        
        var row = table.getRow(r);
        
        // Fetch species data
        var species = row.getString('species');
        if (!data[species])
            data[species] = {}; // Create species object if not exists already
        print(species);
        
        // Fetch chromosome data
        var chrom = row.getString('chromosome');
        if (!data[species][chrom])
            data[species][chrom] = {}; // Create chromosome object if not exists already
        
        // Chromosome length
        var chrom_length = Number(row.getString('chromosome length (bp)'));
        data[species][chrom]['length'] = chrom_length;
        
        // Centromere position
        var chrom_cent = (  Number(row.getString('centromeric region start')) 
                          + Number(row.getString('centromeric region end'))   )/2; // Just in the middle.
        data[species][chrom]['centromere'] = chrom_cent;
    }
    
    return data;
}
