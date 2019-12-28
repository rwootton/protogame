import React from 'react';

const SlotChanger = ({
  name,
  variations,
  colors,
  currentColor,
  currentVariation,
  onChangeVariation,
  onChangeColor
}) => {

  if(colors.length === 1) return null;

  const getNextItem = (list, currentIndex, direction) => {
    let newIndex = currentIndex + direction;
    if(newIndex < 0) newIndex = list.length-1;
    if(newIndex == list.length) newIndex = 0;
    return list[newIndex]
  }

  const changeColor = (direction) => {
    onChangeColor(name, getNextItem(colors, colors.indexOf(currentColor), direction));
  }

  const changeVariant = (direction) => {
    onChangeVariation(name, getNextItem(variations, variations.indexOf(currentVariation), direction));
  }

  return (
    <div>
      <div className="label">
        {name}
      </div>
      <div className="section">
        <span className="button" onClick={()=>changeColor(-1)}>{"<"}</span>
        <span className="option">color</span>
        <span className="button"onClick={()=>changeColor(1)}>{">"}</span>
      </div>
      {variations.length > 1 ? <div className="section">
        <span className="button" onClick={()=>changeVariant(-1)}>{"<"}</span>
        <span className="option">variant</span>
        <span className="button" onClick={()=>changeVariant(1)}>{">"}</span>
      </div> : null}
    </div>

  );
}

export default SlotChanger;