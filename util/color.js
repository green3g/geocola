export default {
  componentToHex: function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },
  rgbToHex: function(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
};
