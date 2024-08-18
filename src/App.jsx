import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashbaord from './pages/Dashboard';
import ExamsActive from './pages/ExamsActive';
import ExamStep from './pages/ExamStep';
import About from './pages/About';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Courses from './pages/Subjects';
import PerformaceHistory from './pages/PerformaceHistory';
import ForgotPassword from './AuthPages/ForgotPassword';
import Signup from './AuthPages/Signup';
import Signin from './AuthPages/Signin';
import Notfound from './pages/Notfound';
import CreateSubjects from './Admin/CreateSubjects';
import CreateQuestions from './Admin/CreateQuestions';
import QuestionList from './Admin/QuestionList';
import SubjectCombination from './pages/SubjectCombination';
import Correction from './pages/Correction';
import { UserProvider } from './context/user/UserContext';  // Import the UserProvider
import { SubjectCombinationProvider } from './context/subjectCombination/SubjectCombinationContext';
import { ExamProvider } from './context/Exams/ExamContext';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashbaord />} />
        <Route path='/exam-step' element={<ExamStep />} />
        <Route path='/active-exam' element={<ExamsActive />} />
        <Route path='/correction/:exams_id' element={<Correction />} />
        <Route path="/about" element={<About />} />
        <Route path="/subjects" element={<Courses />} />
        <Route path="/performace-history" element={<PerformaceHistory />} />
        <Route path="/welcome-page" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-subject" element={<CreateSubjects />} />
        <Route path="/create-questions" element={<CreateQuestions />} />
        <Route path="/questions-list" element={<QuestionList />} />
        <Route path="/subject-combination" element={<SubjectCombination />} />
        <Route path="*" element={<Notfound />} />
      </Route>
    )
  );

  return (
    <UserProvider>
      <SubjectCombinationProvider>
        <ExamProvider>
          <RouterProvider router={router} />
        </ExamProvider>
      </SubjectCombinationProvider>
    </UserProvider>
  );
};

export default App;
