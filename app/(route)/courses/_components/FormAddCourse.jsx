"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumericFormat } from "react-number-format";
import PropTypes from "prop-types";
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
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
      file:border-0 file:bg-transparent 
      file:text-sm file:font-medium placeholder:text-muted-foreground 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
      focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
});

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function FormAddCourse({ onClose, onShowSnackbar }) {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    levelCourse: "",
    price: "0",
    description: "",
  });

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanPrice = formData.price.replace(/[^\d.-]/g, "");

    try {
      const response = await fetch(
        "http://localhost:8080/course/create-course",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, price: cleanPrice }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        onShowSnackbar("Course added successfully!", "success");
        console.log(result);
        setOpen(false); // Close on success
        onClose(); // Call the onClose function passed as prop
      } else {
        const error = await response.json();
        onShowSnackbar(error.message || "Failed to add course.", "error");
      }
    } catch (err) {
      console.error(err);
      onShowSnackbar("An unexpected error occurred.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, levelCourse: value }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) onClose(); // Gọi onClose khi đóng dialog
      }}
    >
      <DialogContent className="sm:max-w-[450px] h-[350px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="levelCourse" className="text-sm font-medium">
                  Level *
                </label>
                <Select
                  name="levelCourse"
                  value={formData.levelCourse}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger id="levelCourse">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Beginner",
                      "Intermediate",
                      "Advanced",
                      "Proficient",
                      "Expert",
                    ].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <NumericFormatCustom
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-3 p-1">Đây là nội dung</div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
