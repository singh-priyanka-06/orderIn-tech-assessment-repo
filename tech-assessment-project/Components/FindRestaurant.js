import { useEffect, useState } from "react";

import allResturants from "../data/SampleData.json";

const normalizedTextForMatch = (text) => {
  return text.trim().toLowerCase();
};

// Get location and itemName from user input
const searchStringToTownAndItemName = (input) => {
  const [item, location] = input.split("in");
  
  return {
  itemName: normalizedTextForMatch(item || ""),
  location: normalizedTextForMatch(location || "")
  };
};

export default function FindRestaurant() {
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState({
    itemName: "",
    location: ""
  });
  const [veiwRestaurants, setVeiwRestaurants] = useState();

  useEffect(() => {
    setVeiwRestaurants(() => {
      const { itemName, location } = searchData;
      return allResturants
        .filter((item) => {
          return normalizedTextForMatch(item.City).includes(location);
        })
        .map((item) => {
          let matchesMenuItems = [];
          let found = false;
          item.Categories.forEach((category) => {
            if (normalizedTextForMatch(category.Name).includes(itemName)) {
              found = true;
              matchesMenuItems = [...matchesMenuItems, ...category.MenuItems];
            } else {
              category.MenuItems.forEach((menuItem) => {
                if (normalizedTextForMatch(menuItem.Name).includes(itemName)) {
                  found = true;
                  matchesMenuItems = [...matchesMenuItems, menuItem];
                }
              });
            }
          });
          if (found) {
            return {
              ...item,
              matchesMenuItems
            };
          }
          return found;
        })
        .filter((item) => item);
      //TODO: Add rating and num of item based filter
    });
  }, [searchData]);

  const handleSearchTextChange = (e) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    setSearchData(searchStringToTownAndItemName(newValue));
  };

  //TODO:select items and form submit functionality

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("submitted");
      }}
      className="App"
    >
      <input value={searchInput} onChange={handleSearchTextChange} />
      {searchData.itemName?.length > 0 && (
        <h4>
          {searchData.itemName} restaurants{" "}
          {searchData.location?.length > 0 ? `in ${searchData.location}` : ""}{", "}
          we found for you:
        </h4>
      )}
      <div>
        {veiwRestaurants &&
          veiwRestaurants.map((restaurant) => {
            return (
              <div
                key={restaurant.id}
                style={{
                  width: "calc(100% - 30px)",
                  textAlign: "left",
                  border: "1px solid black",
                  margin: 15,
                  padding: 10,
                  boxSizing: "border-box"
                }}
              >
                <p>
                  {restaurant.Name} - {restaurant.Suburb} - rated #{" "}
                  {restaurant.Rank} overall 
                </p>
                <p>City: {restaurant.City}</p>
                <div>
                  {restaurant.matchesMenuItems.map((menuItem) => {
                    return (
                      <label key={menuItem.Id} style={{ display: "block" }}>
                        <input
                          type="checkbox"
                          name={menuItem.Name}
                          value={menuItem.Id}
                        />
                        <span>&nbsp;{menuItem.Name}.</span>&nbsp;
                        <span>R{menuItem.Price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        {veiwRestaurants?.length === 0 && <h5>No restaurant found</h5>}
      </div>

      <div>
        <button type="submit">Order</button>
      </div>
    </form>
  );
}
