function GetSKUMain(SKU)
{
    let Index = SKU.indexOf("-");
    let code = SKU.substring(3, Index);
    return code;
}

/*Splits BOM in Material only EX: "-BLKI" */
function GetMaterial(SKU)
{
    let Index = SKU.indexOf("-");
    let mat = SKU.substring(Index, SKU.length);
    return mat;
}
let Extra1, Extra2, IndexF, IndexL, SKULength, EXT, Itr, Plt;
/* ------ Main Code ----- */
function FindTheSKU()
{
console.log("running SKU");
let CombinedSKU = document.getElementById("SKU").value; //SKU pulled from custom builder
const SKUHolder = []; //SKU variables
const BOM = "BOM";

CombinedSKU += BOM;
let SKULength = CombinedSKU.length -3;
 IndexF = 0;

while(IndexF < SKULength)
{
     IndexL = CombinedSKU.indexOf(BOM, IndexF +2);
    let temp = CombinedSKU.substring(IndexF, IndexL);
    SKUHolder.push(temp);
    IndexF = IndexL;
}

/* Sort Extra Parts */
switch(SKUHolder.length)
{
    case 4:
    Extra1 = SKUHolder[3];
        break;
    case 5:
    Extra1 = SKUHolder[3];
    Extra2 = SKUHolder[4];
     break;
}

/* -- Building Proper BOM -- */
const BeltE = SKUHolder[0]; //Belt Exterior SKU
const LegI = SKUHolder[1]; //Leg Interior SKU
const BeltP = BOM + GetSKUMain(SKUHolder[0]) + GetMaterial(SKUHolder[2]); //belt plate BOM
const BeltI = BOM +  GetSKUMain(SKUHolder[0]) + GetMaterial(SKUHolder[1]); //belt interior BOM
const LegE = BOM + GetSKUMain(SKUHolder[1]) + GetMaterial(SKUHolder[0]); //leg exterior BOM


/*Outputs*/
console.log(SKUHolder.length);
console.log(BeltE);
document.getElementById("BEXT").innerHTML = BeltE;
console.log(BeltI);
document.getElementById("BINT").innerHTML = BeltI;
console.log(BeltP);
document.getElementById("PLT").innerHTML = BeltP;
console.log(LegE);
document.getElementById("LEXT").innerHTML = LegE;
console.log(LegI);
document.getElementById("LINT").innerHTML = LegI;
console.log(Extra1);
document.getElementById("EX1").innerHTML = Extra1;
console.log(Extra2);
document.getElementById("EX2").innerHTML = Extra2;

}

const subButton = document.getElementById("SKUSub").innerHTML;

subButton.addEventListener('click', FindTheSKU());