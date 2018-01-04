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

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
}

function draw() {
  // Calculate scaling
  var left = centromereStart;
  var right = chromosomeLength - centromereEnd;
  var maxSide = Math.max(left, right);
  var margin = 300;
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
