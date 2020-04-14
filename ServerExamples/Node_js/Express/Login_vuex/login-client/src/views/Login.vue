<template>
    <div>
        <form @submit.prevent="login">
            <input type="email" v-model="email" required>
            <input type="password" v-model="password" required>
            <button type="submit">login</button>
        </form>
        <button @click="test_ok">test</button>
        <button @click="logout">logout</button>
    </div>
</template>
<script>
import axios from "axios"
export default {
   data:function(){
       return {
           email:null,
           password:null,
       }
   },
   methods:{
       login:async function(){
           //const params = new URLSearchParams();
           //params.append('username', this.email);    // 渡したいデータ分だけappendする
           //params.append('password', this.password);
           let data = {email:this.email, password:this.password}
           let response = await axios.post('/api/login',data)
           .catch(() => {
               console.log("error")
            })
           if(response != null && response.status == 200){
               console.log("login !!!")
           }
       },
       test_ok:async function(){
           console.log("test")
           let response = await axios.get('/api/ok')
           .catch(() => {
               console.log("error")
            })
           if(response != null && response.status == 200){
               console.log("login OK!!!")
           }
       },
       logout:async function(){
           let response = await axios.post('/api/logout')
           .catch(() => {
               console.log("error")
           })
           if(response != null && response.status == 200){
               console.log("logout !!!")
           }
       }
   }
}
</script>