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
    <Button size='large' status='default'>Default</Button>
    <Button size='large' status='primary'>Primary</Button>
    <Button size='large' status='success'>Success</Button>
    <Button size='large' status='info'>Info</Button>
    <Button size='large' status='warning'>Warning</Button>
    <Button size='large' status='danger'>Danger</Button>
    <Button size='large' status='link'>Link</Button>
</div>
```
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

