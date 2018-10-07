const colors =['blue','green','red'];


const randomColor = ()=>{
	return colors[parseInt(Math.random()*3)];
}

module.exports = randomColor;