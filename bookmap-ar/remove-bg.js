import Jimp from 'jimp';

Jimp.read('./public/assets/little-prince.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If color is close to white
      if (red > 230 && green > 230 && blue > 230) {
        if (Math.abs(red - green) < 20 && Math.abs(red - blue) < 20) {
             // Make transparent
             this.bitmap.data[idx + 3] = 0; 
        }
      }
    });
    
    // Add a slight blur to smooth out the jagged white edges a tiny bit
    // image.blur(1); // Optional, maybe too slow
    
    return image.writeAsync('./public/assets/little-prince-transparent.png');
  })
  .then(() => {
    console.log("SUCCESS: Background removed!");
  })
  .catch(err => {
    console.error("ERROR:", err);
  });
