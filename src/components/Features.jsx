import { GraduationCap, Users, BookOpen, Award } from "lucide-react";
import { useEffect, useState } from "react";

function Counter({ end }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}</span>;
}

export default function Features() {
  const items = [
    {
      icon: GraduationCap,
      value: 14,
      suffix: "+",
      desc: "Years of Teaching Experience",
    },
    {
      icon: Users,
      value: 50,
      suffix: "K+",
      desc: "Trained Students",
    },
    {
      icon: BookOpen,
      value: 100,
      suffix: "+",
      desc: "Professional Courses",
    },
    {
      icon: Award,
      value: 99,
      suffix: "%",
      desc: "Student Satisfaction",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:shadow-md transition"
          >
            <item.icon className="w-10 h-10 text-blue-600 mb-4" />

            <h3 className="text-3xl font-bold text-gray-800">
              <Counter end={item.value} />
              {item.suffix}
            </h3>

            <p className="text-gray-600 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
