import { useEffect, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";

import allResturants from "../data/SampleData.json";
import Modal from "./Modal";
import SearchRestaurantCard from "./SearchRestaurantCard";

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

const useStyles = createUseStyles({
  searchInput: {
    border: "none",
    borderRadius: 6,
    background: "#55C2BB",
    color: "#fff",
    padding: 7,
    fontWeight: "bold",
    fontSize: 18,
    "&:focus, &:active": {
      border: "none",
      borderRadius: 6,
      outline: "none"
    }
  },
  button: {
    height: 40,
    width: 180,
    background: "#ED7422",
    borderRadius: 6,
    color: "#fff",
    border: "none",
    fontSize: 18,
    cursor:"pointer"
  }
})

// The core Component to Search Restaurant
export default function FindRestaurant() {
  const classes = useStyles()
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState({
    itemName: "",
    location: ""
  });
  const [veiwRestaurants, setVeiwRestaurants] = useState();
  const [selectedItems, setSelectedItems] = useState([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const toggleSuccessModal = ()=> setShowSuccessModal(state=>!state)

  const handleSelectItem = (item)=> {
    setSelectedItems(state=>[...state, item])
  }

  const handleRemoveSelectItem = (item)=> {
    setSelectedItems(state=>state.filter(prevItem=>prevItem.Id !== item.Id))
  }

  /* 
    Everytime on the change of searched data, rematching restuarants 
    and their matched  menu-items.  
  */
  useEffect(() => {
    const { itemName, location } = searchData;
      setVeiwRestaurants(() => {
        return allResturants
          .filter((item) => {
            return normalizedTextForMatch(item.City).includes(location);
          })
          .map((item) => {
            let matchesCategoriesAndMenuItems = [];
            let found = false;
            let itemCount = 0
            item.Categories.forEach((categorie) => {
              if (normalizedTextForMatch(categorie.Name).includes(itemName)) {
                found = true;
                itemCount += categorie.MenuItems.length
                matchesCategoriesAndMenuItems = [
                  ...matchesCategoriesAndMenuItems, 
                  categorie
                ];
              } else {
                categorie.MenuItems.forEach((menuItem) => {
                  if (normalizedTextForMatch(menuItem.Name).includes(itemName)) {
                    found = true;
                    itemCount += 1
                    const categoryAlreadyAdd = matchesCategoriesAndMenuItems.find(matchCategore=>{
                      return matchCategore.id === categorie.id
                    })
                    const menuWithCategore = !!categoryAlreadyAdd 
                      ? 
                        {
                          ...categoryAlreadyAdd,
                          MenuItems: [
                            ...categoryAlreadyAdd.MenuItems,
                            menuItem
                          ]
                        }
                      :
                        {
                          ...categorie,
                          MenuItems: [menuItem]
                        }
                    matchesCategoriesAndMenuItems = [
                      ...matchesCategoriesAndMenuItems, 
                      menuWithCategore
                    ];
                  }
                });
              }
            });
            if (found) {
              return {
                ...item,
                matchesCategoriesAndMenuItems,
                itemCount
              };
            }
            return found;
          })
          .filter((item) => item)
          .sort((a, b)=> (b.itemCount - a.itemCount) + (b.Rank - a.Rank))
      });
  }, [searchData]);

  const totalPrice = useMemo(()=>{
    let total = 0
    selectedItems.forEach(item=>{
      total += item.Price
    })
    return total
  }, [selectedItems])

  const handleSearchTextChange = (e) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    setSearchData(searchStringToTownAndItemName(newValue));
  };

  const handleSubmit = (e)=> {
    e.preventDefault();
    if(selectedItems.length > 0) {
      toggleSuccessModal()
      setSelectedItems([])
    } else {
      alert("Please select at least one item.")
    }
  }

  return (
    <>
      <div
        style={{
          fontFamily: "sans-serif",
          padding: 15
        }}
      >
        <div
          style={{
            position: "relative"
          }}
        >
          <input 
            value={searchInput} 
            onChange={handleSearchTextChange} 
            style={{
              height: 30,
              width: "100%",
              marginBottom: 35,
              paddingLeft: 8
            }}
            className={classes.searchInput}
          />
          
          <img 
            style={{
              width: 25, 
              height: 25,
              position:"absolute",
              right: 0,
              top: 9
            }} 
            src="/search.png" 
            alt="search" 
          />
        </div>

        {searchData.itemName?.length > 0 && (
          <h4>
            {searchData.itemName} resturnates{" "}
            {searchData.location?.length > 0 ? `in ${searchData.location}` : ""}{" "}
            we found for you:
          </h4>
        )}

        <div>
          {veiwRestaurants &&
            veiwRestaurants.map((restaurant) => {
              return (
                <SearchRestaurantCard 
                  key={restaurant.Id} 
                  restaurant={restaurant} 
                  selectedItems={selectedItems}
                  handleSelectItem={handleSelectItem}
                  removeSelectItem={handleRemoveSelectItem}
                />
              );
            })}
          {veiwRestaurants?.length === 0 && <h5>No restaurant found</h5>}
        </div>

        <div 
          style={{
            width: "100%", 
            display: 'flex', 
            justifyContent: "center",
            marginTop: 15
          }}
        >
          <button 
            className={classes.button}
            onClick={handleSubmit}
          >Order - R{totalPrice}</button>
        </div>
      </div>

      <Modal show={showSuccessModal} onClose={toggleSuccessModal}>
        <div style={{display: "flex", paddingBottom: 20, flexDirection: "column", alignItems: "center"}}>
          <div 
            style={{
              borderBottom: '1px solid', 
              width: "100%", 
              padding: 10
            }}
          >
            <p style={{margin: 0, marginLeft: 15, fontSize: 18}}>Success</p>
          </div>
          <p style={{textAlign: "center"}}>Your order has been palced!<br/>
            Leave the rest up to the chefs<br/>
            and our drivers!
          </p>
          
          <button 
            className={classes.button}
            onClick={toggleSuccessModal}
          >
            Ok
          </button>
        </div>
      </Modal>
    </>
  );
}
