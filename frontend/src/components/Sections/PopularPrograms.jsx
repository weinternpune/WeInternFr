import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useCourses } from "../../context/CoursesContext";
import { slugify, getTechIcon } from "../../data/courseExtras";
import "./PopularPrograms.css";

const getTools = (tools) => {
  if (Array.isArray(tools)) return tools;
  if (typeof tools === "string") return tools.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

const PopularPrograms = () => {
  const { activeCourses } = useCourses();
  const navigate = useNavigate();
  const courses = (activeCourses || []).slice(0, 4);

  if (!courses.length) return null;

  return (
   <></>
  );
};

export default PopularPrograms;
