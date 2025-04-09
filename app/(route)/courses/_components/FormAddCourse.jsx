import React, { useEffect,useState } from "react";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { NumericFormat } from "react-number-format";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../../features/category/categorySlice";


const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function FormAddCourse({ onShowSnackbar }) {

  const [level, setLevel] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openLevel, setOpenLevel] = React.useState(false);
  const [isCancelClicked, setIsCancelClicked] = React.useState(false);
  const [content, setContent] = React.useState(""); // Quản lý nội dung editor
  const [values, setValues] = React.useState({
    price: "0",
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"], // Các kiểu chữ
      [{ list: "ordered" }, { list: "bullet" }], // Danh sách
      ["link", "image"], // Chèn link và ảnh
      ["clean"], // Xoá định dạng
    ],
  };

  const handleChangeText = (value) => {
    setContent(value); // Cập nhật nội dung khi thay đổi
  };

  const handleSave = async () => {
    try {
      const formData = {
        name: document.getElementById("name").value,
        levelCourse: level, // Level từ Select
        description: content, // Nội dung từ ReactQuill
        price: values.price.replace(/[^\d.-]/g, ""), // Loại bỏ ký tự không phải số
      };

      // Gọi API bằng fetch
      const response = await fetch("http://localhost:8080/course/create-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Chuyển dữ liệu sang định dạng JSON
      });
      
      // Kiểm tra kết quả trả về
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response:", responseData);
        onShowSnackbar("Course added successfully!", "success");

      } else {
        // Xử lý lỗi nếu HTTP status không phải 200-299
        onShowSnackbar(errorData.message || "Failed to add course.", "error");
      }
    } catch (error) {
      // Xử lý lỗi không liên quan đến HTTP (ví dụ: mạng)
      console.error("Error:", error.message);
      onShowSnackbar("An unexpected error occurred.", "error");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setIsCancelClicked(false);
  };
  const handleClose = () => {
    if (isCancelClicked) {
      setOpen(false); // Chỉ đóng khi nút Cancel được nhấn
    }
  };

  const handleCancel = () => {
    setIsCancelClicked(true); // Đánh dấu là nút Cancel đã được nhấn
    setOpen(false);
  };

  const handleClickOpenLevel = () => {
    setOpenLevel(true);
  };
  const handleCloseLevel = () => {
    setOpenLevel(false);
  };

  const handleChange = (event) => {
    setLevel(event.target.value);
  };

  const handleChangePrice = (event) => {
    const value = event.target.value;
    const numericValue = value.replace(/[^\d.-]/g, ""); // Loại bỏ tất cả ký tự không phải là số và dấu "."
    setValues({
      ...values,
      [event.target.name]: numericValue,
    });
  };


  //cau hinh categories
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Course
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            // Tạo đối tượng FormData từ form
            const formData = new FormData(event.currentTarget);

            // Thêm thủ công các trường không chuẩn vào formData
            formData.append("levelCourse", level); // Giá trị của Select
            formData.append("description", content); // Giá trị của ReactQuill

            // Lấy dữ liệu từ form
            const formJson = Object.fromEntries(formData.entries());

            // Loại bỏ dấu $ và các ký tự không phải số từ giá trị price
            const cleanPrice = formJson.price.replace(/[^\d.-]/g, ""); // Xoá dấu $ và các ký tự không phải số

            // Cập nhật lại giá trị đã loại bỏ ký tự $ vào formJson
            formJson.price = cleanPrice;

            console.log(formJson); // Kiểm tra dữ liệu sau khi thay đổi
            handleSave();
            handleCancel();
          },
          sx: {
            height: "535px",
            width: "450px", // Cố định chiều ngang của Dialog
            maxWidth: "80%", // Bạn có thể điều chỉnh tỷ lệ phần trăm nếu cần
          },
        }}
      >
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            <FormControl sx={{ minWidth: 200 }} variant="standard">
              <InputLabel id="demo-controlled-open-select-label">
                Level*
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={openLevel}
                onClose={handleCloseLevel}
                onOpen={handleClickOpenLevel}
                value={level}
                label="Level"
                required
                onChange={handleChange}
              >
                <MenuItem value={"Beginner"}>Beginner</MenuItem>
                <MenuItem value={"Intermediate"}>Intermediate</MenuItem>
                <MenuItem value={"Advanced"}>Advanced</MenuItem>
                <MenuItem value={"Proficient"}>Proficient</MenuItem>
                <MenuItem value={"Expert"}>Expert</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <TextField
                label="Price"
                value={values.price}
                onChange={handleChangePrice}
                name="price"
                id="formatted-numberformat-input"
                slotProps={{
                  input: {
                    inputComponent: NumericFormatCustom,
                  },
                }}
                variant="standard"
              />
            </FormControl>
          </div>
          <div className="mt-3 p-1">
            <ReactQuill
              theme="snow" // Giao diện mặc định
              value={content}
              onChange={handleChangeText}
              placeholder="Nhập nội dung của bạn..."
              modules={modules}
              formats={[
                "header",

                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "link",
                "image",
              ]}
              style={{ height: "200px", marginBottom: "20px" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={handleCancel}
            className="bg-white text-black hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
  
    </div>
  );
}
