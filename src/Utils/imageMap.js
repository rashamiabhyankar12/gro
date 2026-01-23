export const imageMap = {
  "Blueberry.jpg":require("../Images/Blueberry.jpg"),
  "Img-03.png": require("../Images/Img-03.png"),
  "Img-10.png": require("../Images/Img-10.png"),

  "5247c9d2-251e-4ab4-beb0-0cf98e3542b8.png": require("../Images/5247c9d2-251e-4ab4-beb0-0cf98e3542b8.png"),
  "Catfish.jpg": require("../Images/Catfish.jpg"),
  "Chips.jpg": require("../Images/Chips.jpg"),
  "Duck.jpg": require("../Images/Duck.jpg"),
  "Egg.jpg": require("../Images/Egg.jpg"),
  "Finger-beef.jpg": require("../Images/Finger-beef.jpg"),
  "Greengrape.jpg": require("../Images/Greengrape.jpg"),
  "Img-01.png": require("../Images/Img-01.png"),
  "Img-02.png": require("../Images/Img-02.png"),
  "Img-04.png": require("../Images/Img-04.png"),
  "Img-05.png": require("../Images/Img-05.png"),
  "Img-06.png": require("../Images/Img-06.png"),
  "Img-07.png": require("../Images/Img-07.png"),
  "Img-08.png": require("../Images/Img-08.png"),
  "Img-09.png": require("../Images/Img-09.png"),
  "Img-11.png": require("../Images/Img-11.png"),
  "Img-12.png": require("../Images/Img-12.png"),

  "Img-14.png": require("../Images/Img-14.png"),
  "Img-15.png": require("../Images/Img-15.png"),
  "Product-8.jpg": require("../Images/Product-8.jpg"),
  "Salmon.jpg": require("../Images/Salmon.jpg"),
  "Tastydaily-2600336736.jpg": require("../Images/Tastydaily-2600336736.jpg"),
  "Tastydaily-2600436451.jpg": require("../Images/Tastydaily-2600436451.jpg")

  // Add more as needed
};
// Helper to normalize image source
export const getImageSource = (imageName) => imageMap[imageName] || null;
