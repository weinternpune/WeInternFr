// TEST: Verify all 13 courses are present
// Run this in browser console after opening localhost:3000

console.log('🧪 Testing Course Visibility...\n');

// Get all courses from localStorage
const storageKey = 'weintern_courses_v4';
const coursesData = localStorage.getItem(storageKey);

if (!coursesData) {
  console.error('❌ No courses found in localStorage!');
  console.log('Storage Key:', storageKey);
} else {
  const courses = JSON.parse(coursesData);
  console.log(`✅ Found ${courses.length} courses in localStorage\n`);
  
  // List all courses
  courses.forEach((course, index) => {
    const price = course.originalPrice 
      ? `₹${course.price} (was ₹${course.originalPrice})` 
      : `₹${course.price}`;
    console.log(`${index + 1}. ${course.title} - ${price}`);
  });
  
  // Check for the 3 new programming courses
  console.log('\n🔍 Checking for new programming courses:');
  const pythonCourse = courses.find(c => c.title.includes('Python'));
  const javaCourse = courses.find(c => c.title.includes('Java'));
  const cppCourse = courses.find(c => c.title.includes('C/C++'));
  
  console.log(pythonCourse ? '✅ Python Programming found' : '❌ Python Programming NOT found');
  console.log(javaCourse ? '✅ Java Programming found' : '❌ Java Programming NOT found');
  console.log(cppCourse ? '✅ C/C++ Programming found' : '❌ C/C++ Programming NOT found');
}

console.log('\n📝 If any courses are missing, run: localStorage.clear(); location.reload();');
