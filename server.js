const express=require('express');
const path=require('path');
const app=express();
app.use(express.json());app.use(express.static(path.join(__dirname,'public')));
let nextId=10;
let slots=[
{id:1,date:'2026-09-29',start:'16:30',end:'17:30',venue:'Padel Dome',court:'Court 1',capacity:4,bookings:[{name:'Tracey',phone:'087 555 0142'}]},
{id:2,date:'2026-09-29',start:'17:30',end:'18:30',venue:'Padel Dome',court:'Court 1',capacity:4,bookings:[]},
{id:3,date:'2026-09-29',start:'18:30',end:'19:30',venue:'Padel Dome',court:'Court 1',capacity:4,bookings:[{name:'Tiago',phone:'087 555 0191'},{name:'Gav',phone:'086 555 0134'},{name:'Shivaun',phone:'085 555 0188'}]},
{id:4,date:'2026-09-29',start:'19:30',end:'20:30',venue:'Padel Dome',court:'Court 1',capacity:4,bookings:[{name:'David Morgan',phone:'087 555 0177'}]},
{id:5,date:'2026-10-01',start:'10:00',end:'11:00',venue:'Padel Dome',court:'Court 2',capacity:4,bookings:[]},
{id:6,date:'2026-10-01',start:'18:00',end:'19:00',venue:'Padel Dome',court:'Court 2',capacity:4,bookings:[]}
];
const sort=()=>slots.sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));
app.get('/api/slots',(req,res)=>res.json(sort()));
app.post('/api/book/:id',(req,res)=>{const s=slots.find(x=>x.id==req.params.id);if(!s)return res.status(404).json({error:'Lesson not found'});if(s.bookings.length>=s.capacity)return res.status(409).json({error:'This lesson is full'});const name=String(req.body.name||'').trim(),phone=String(req.body.phone||'').trim();if(!name||!phone)return res.status(400).json({error:'Name and mobile number are required'});s.bookings.push({name,phone});res.json(s)});
app.post('/api/admin/slots',(req,res)=>{const {date,venue,court,times}=req.body;if(!date||!venue||!court||!Array.isArray(times)||!times.length)return res.status(400).json({error:'Complete all fields and add at least one time'});const made=times.map(t=>{const [h,m]=t.split(':').map(Number);const d=new Date(2000,0,1,h,m);d.setMinutes(d.getMinutes()+60);const end=`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;const s={id:nextId++,date,start:t,end,venue,court,capacity:4,bookings:[]};slots.push(s);return s});res.json(made)});
app.delete('/api/admin/slots/:id',(req,res)=>{slots=slots.filter(x=>x.id!=req.params.id);res.json({ok:true})});
app.delete('/api/admin/slots/:id/bookings/:i',(req,res)=>{const s=slots.find(x=>x.id==req.params.id);if(!s)return res.status(404).json({error:'Not found'});s.bookings.splice(Number(req.params.i),1);res.json(s)});
app.get('/health',(req,res)=>res.send('ok'));
app.use((req,res,next)=>{if(req.method!=='GET'||req.path.startsWith('/api/'))return next();res.sendFile(path.join(__dirname,'public','index.html'))});
const port=process.env.PORT||3000;app.listen(port,'0.0.0.0',()=>console.log(`Jose Padel Booking running on ${port}`));