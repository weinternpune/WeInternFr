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
    <section className="pp-section" id="courses">
      <div className="pp-header">
        <div>
          <span className="pp-eyebrow">Programs</span>
          <h2 className="pp-title">Popular <span className="pp-title-accent">Programs</span></h2>
        </div>
        <button
          className="pp-view-all"
          onClick={() => navigate("/#courses")}
        >
          View All Programs <Icon icon="lucide:arrow-right" width={14} height={14} />
        </button>
      </div>

      <div className="pp-grid">
        {courses.map((c, i) => {
          const tools = getTools(c.tools);
          const slug = slugify(c.title);
          return (
            <div
              className="pp-card"
              key={c._id || c.title}
              onClick={() => navigate(`/courses/${slug}`)}
            >
              <div className="pp-card-top">
                <div className="pp-tech-row">
                  {tools.slice(0, 4).map((t) => (
                    <span className="pp-tech-badge" key={t} title={t}>
                      <Icon icon={getTechIcon(t)} width={16} height={16} />
                    </span>
                  ))}
                </div>
              </div>
              <div className="pp-card-body">
                <h3>{c.title}</h3>
                <button
                  className="pp-join-now"
                  onClick={(e) => { e.stopPropagation(); navigate(`/courses/${slug}`); }}
                >
                  Join Now <Icon icon="lucide:arrow-right" width={13} height={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularPrograms;
