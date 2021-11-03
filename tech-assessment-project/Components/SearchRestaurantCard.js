import React, { useState, useEffect } from 'react'

const MenuItems = ({
  menuItem, 
  selected, 
  handleSelectItem, 
  removeSelectItem
})=> {
  const [checked, setChecked] = useState(selected)

  useEffect(() => {
    setChecked(selected)
  }, [selected])

  return (
    <label 
      key={menuItem.Id} 
      style={{ 
        display: "block", 
        fontSize: 16, 
        marginBottom: 15
      }}
    >
      <input
        type="checkbox"
        name={menuItem.Name}
        value={menuItem.Id}
        checked={checked}
        onChange={(e)=> {
          if(e.target.checked) {
            handleSelectItem(menuItem)
          } else {
            removeSelectItem(menuItem)
          }
        }}
      />
      <span>&nbsp;{menuItem.Name}.</span>&nbsp;
      <span>R{menuItem.Price}</span>
    </label>
  )
}

export default function SearchRestaurantCard({
  restaurant, 
  handleSelectItem, 
  removeSelectItem,
  selectedItems
}) {

  return (
    <div
      key={restaurant.Id}
      style={{
        width: "calc(100% - 30px)",
        textAlign: "left",
        paddingBottom: 15,
        boxSizing: "border-box"
      }}
    >
      <div style={{display: "flex", marginBottom: 10, alignItems: "center"}}>
        <img 
          style={{width: 50, height: 50, marginRight: 10}} 
          src={restaurant.LogoPath} 
          alt={restaurant.Name} 
        /> 
        <h2>
          {restaurant.Name} - {restaurant.Suburb} - rated #{" "}
          {restaurant.Rank} overall 
        </h2>
      </div>
     
      <div style={{paddingLeft: 20}}>
        {restaurant.matchesCategoriesAndMenuItems?.map((categorie, index)=> {
          return (
            <div key={categorie.Name + index}>
              <h3>{categorie.Name}</h3>
              <div style={{paddingLeft: 15}}>
                {categorie.MenuItems.map((menuItem) => {
                  const selected = !!selectedItems.find(selectedItem=>selectedItem.Id === menuItem.Id)
                  return <MenuItems 
                    key={menuItem.Id}
                    menuItem={menuItem} 
                    handleSelectItem={handleSelectItem}
                    removeSelectItem={removeSelectItem}
                    selected={selected}
                  />;
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
