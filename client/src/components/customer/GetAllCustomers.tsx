import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFetch } from '@/hooks/useFetch';
import {getCustomers} from '../../api/customers'

function GetAllCustomers() {
  const {data:customers} = useFetch(getCustomers)
  
  return <div></div>

}

export default GetAllCustomers;