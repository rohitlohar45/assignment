import React, { useState, useEffect, useContext } from "react";

import ItemCard from "./ItemCard";
import TextField from "@material-ui/core/TextField";
import {
  Grid,
  Typography,
  FormControl,
  Box,
  InputAdornment,
  Select,
  InputLabel,
  MenuItem
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { isAuthenticated } from "../auth";
import { addItem, getData } from "./coreapicalls";
import { BudgetContext } from "../BudgetContext";

// import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    backgroundColor: "#e53935",
    color: "white",
  },
  addItemButton: theme.blackButton,
  submitButton: theme.greenButton,
  textFieldStyle: {
    margin: theme.spacing(1),
    width: "25ch",
    marginBottom: "1rem",
    [theme.breakpoints.down("sm")]: {
      width: "18ch",
      margin: "0.2rem",
    },
  },
  cardFlexStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const SubGrid = ({ name }) => {
  var data;
  const classes = useStyles();
  const userId = isAuthenticated() && isAuthenticated().user.id;

  const { income, expense, sUpdate } = useContext(BudgetContext);
  const [incomeData, setIncomeData] = income;
  const [expenseData, setExpenseData] = expense;

  //To check whether you have to recall the API
  const [shouldUpdate, setShouldUpdate] = sUpdate;

  const [localData, setLocalData] = useState(0);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemData, setNewItemData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    itemType: name.toLowerCase(),
    user: userId,
  });

  const { month } = useContext(BudgetContext);
  const [curMonth, setCurMonth] = month;
  const [loading, setLoading] = useState(false);

  // const [date, setDate] = useState("");

  if (name === "Income") {
    data = incomeData;
  } else {
    data = expenseData;
  }

  const handleChange = (name) => (event) => {
    setNewItemData({
      ...newItemData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    setNewItemData({ ...newItemData });
    setShowAddItem(false);
    addItem(newItemData);
    setLoading(false);
    setShouldUpdate(!shouldUpdate);
  };

  // //Calc the sum of income and expense
  const getlocalData = () => {
    let temp = 0;
    data.map((i) => {
      temp = temp + i.amount;
    });
    setLocalData(temp);
  };

  useEffect(() => {
    getlocalData();
    //recalling the API
  }, [data]);

  useEffect(() => {
    if (curMonth !== "all") {
      getData().then((data) => {
        var fData = data.filter(
          (item) =>
            item.user === userId &&
            item.itemType === "income" &&
            item.date.split("-")[1] === curMonth
        );
        setIncomeData(fData.reverse());
        fData = data.filter(
          (item) =>
            item.user === userId &&
            item.itemType === "expense" &&
            item.date.split("-")[1] === curMonth
        );
        setExpenseData(fData.reverse());
      });
    } else {
      getData().then((data) => {
        var fData;
        fData = data.filter(
          (item) => item.user === userId && item.itemType === "income"
        );
        setIncomeData(fData.reverse());
        fData = data.filter(
          (item) => item.user === userId && item.itemType === "expense"
        );
        setExpenseData(fData.reverse());
      });
    }
    //Refreshing data from the API
  }, [shouldUpdate, curMonth]);

  return (
    <div>
      <Grid container spacing={3} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography component="h4" variant="h4">
            {name}
          </Typography>
          <div>
            {name === "Income" ? (
              <Typography variant="subtitle2">
                Total :<span style={{ color: "#43BE31" }}> ₹{localData}</span>
              </Typography>
            ) : (
              <Typography variant="subtitle2">
                Total :<span style={{ color: "#EC4849" }}> ₹{localData}</span>
              </Typography>
            )}
          </div>
          <br />
          <Button
            size="medium"
            className={classes.addItemButton}
            onClick={() => {
              setShowAddItem(!showAddItem);
            }}
          >
            Add Item
          </Button>
          <br />
          {showAddItem ? (
            <Box style={{ marginBottom: "1rem" }}>
              <FormControl>
                <TextField
                  required
                  id="name"
                  label="Enter Name"
                  className={classes.textFieldStyle}
                  onChange={handleChange("title")}
                />
                  <Select
                    labelId="category"
                    id="category"
                    value="category"
                    label="Category"
                    onChange={handleChange("category")}
                  >
                    <MenuItem value="Grocery">Grocery</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Health">Health</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                <TextField
                  required
                  id="amount"
                  label="Amount"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className={classes.textFieldStyle}
                  onChange={handleChange("amount")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
                {/* <Form.Group controlId="formBasicSelect">
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={handleChange("category")}
                  >
                    <option value="Grocery">Grocery</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group> */}
                
                
                {/* <DatePicker
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    handleChange("date");
                  }}
                /> */}
                {/* <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={date}
                    onChange={setDate(date)}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider> */}
                <Button
                  size="small"
                  className={classes.submitButton}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </FormControl>
            </Box>
          ) : (
            ""
          )}
          <br />
          {loading ? (
            <Typography variant="h4" component="h4">
              Loading...
            </Typography>
          ) : (
            <div className={classes.cardFlexStyle}>
              {data.map((i) => {
                return (
                  <ItemCard
                    name={name}
                    key={i.id}
                    id={i.id}
                    title={i.title}
                    description={i.description}
                    amount={i.amount}
                    date={i.date}
                    category = {i.category}
                  />
                );
              })}
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};
export default SubGrid;
