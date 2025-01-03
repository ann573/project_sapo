import { Route, Routes } from 'react-router-dom';
import LoginPage from './page/LoginPage';
import PaymentPage from './page/PaymentPage';
import RegisterPage from './page/RegisterPage';
import LayoutAdmin from './components/LayoutAdmin';
import DashBoard from './page/admin/DashBoard';
import ProductPage from './page/admin/ProductPage';
const App = () => {
 
  return (
    <>
      <Routes>
        <Route path='/' element={<PaymentPage/>}/>

        <Route path='/admin' element={<LayoutAdmin/>}>
          <Route index element={<DashBoard/>}/>
          <Route path='product' element={<ProductPage/>}/>
        </Route>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>
    </>
  )
}

export default App