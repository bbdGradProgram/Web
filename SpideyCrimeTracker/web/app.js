import express from 'express';
import * as path from 'path';


export const app = express();
const port = process.env.port || '3001';

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('*', (req, res) => {
    if(req.path.split('/').length > 2){
        res.redirect('/error');
        return;
    }
    res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));

