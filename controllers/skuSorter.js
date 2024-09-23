const {FindTheSKU} = require('../utils/skuSorter.js')
const expressError = require('../utils/expressError');

module.exports.splitSKU = async (req, res) => {
    const unsplitSku = req.body.sku;
    
    const bom = "BOM";
    if(unsplitSku.indexOf(bom) !== 0) throw new expressError('SKUs must start with BOM', 400);

    const splitSku = await FindTheSKU(unsplitSku);
    res.render('skuSorter', {splitSku});
  
}