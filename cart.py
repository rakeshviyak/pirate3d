from main import BaseHandler

import logging
import strings
import json

def csvtolist(a):
    return a.rstrip(',').split(',')

class CartHandler(BaseHandler):
    def get(self):
        """renders the html page with assignments for the buying cart page"""
        logging.info("Running CartHandler - Get")
        #initialization
        params={}
        params['title']=strings.title
        params['description']=strings.description
        params['web_name']=strings.web_name

        #rendering
        self.render('base.html',**params)

    def post(self):
        """return the cart information in json format"""       
        logging.info("Runing CartHandler - Post")
        #get inputs for the request
        total_cost=str(self.request.get('total_cost'))
        printer_total_price=str(self.request.get('printer_total_price'))
        printer_units=str(self.request.get('printer_units')).lstrip('x')
        cartridge_total_price=str(self.request.get('cartridge_total_price'))
        i_category=csvtolist(str(self.request.get('i_category')))
        i_price=csvtolist(str(self.request.get('i_price')))
        i_group=csvtolist(str(self.request.get('i_group')))
        i_color=csvtolist(str(self.request.get('i_color')))

        #initialization
        keys=['color','category','group','price']
        dictlist=[]
        cartridge={}
        printer={}
        total={}

        #segreration of cart info
        if total_cost.isdigit():
            error=0
            for i in zip(i_color,i_category,i_group,i_price):
                dictlist.append(dict(zip(keys,i)))
            cartridge['cartridge_total_price']=cartridge_total_price
            cartridge['items']=dictlist
            printer['price']=printer_total_price
            printer['units']=printer_units
            total['total_price']=total_cost
            total['cartridge']=cartridge
            total['printer']=printer
            logging.info("cart Json - %s",total)
            message="Thanks for your purchase, Boss !!! :) "
        else:
            error=1
            message="Boss! Select an item before buying now"
        
        #send json as its output
        cart_json=json.dumps({"error":error,"message":message,"cart":total})  
        self.response.headers["Content-Type"] = "application/json; charset=UTF-8"
        self.response.out.write(cart_json)    

