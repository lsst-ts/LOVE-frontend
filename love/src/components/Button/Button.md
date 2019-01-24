Default props:
```jsx
<Button>Default</Button>
```

Different status and size:
``` jsx
<div style={{
    display:'flex',
    flexWrap: 'wrap',
    justifyContent:'space-around'}}>
    <Button status='default'>Default</Button>
    <Button status='primary'>Primary</Button>
    <Button status='success'>Success</Button>
    <Button status='info'>Info</Button>
    <Button status='warning'>Warning</Button>
    <Button status='danger'>Danger</Button>
    <Button status='link'>Link</Button>
</div>
```