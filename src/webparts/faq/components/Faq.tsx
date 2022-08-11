import * as React from 'react';
import styles from './Faq.module.scss';
import { IFaqProps } from './IFaqProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { IFAQ } from '../../../interfaces';
import { getSP } from '../../../pnpjsConfig';
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

const Faq = (props:IFaqProps) =>{

  const LOG_SOURCE = 'FAQ Webpart';
  const LIST_NAME = 'FAQ';
  let _sp:SPFI = getSP(props.context);

  const [faqItems,setFaqItems] = useState<IFAQ[]>([])

  const getFAQItems = async () => {

    console.log('context',_sp)
    const items = _sp.web.lists.getById(props.listGuid).items.select().orderBy('Letter',true).orderBy('Title',true)();

    console.log('FAQ Items',items)

    setFaqItems((await items).map((item:any) => {
      return {
        Id: item.Id,
        Title: item.Title,
        Body: item.Body,
        Letter: item.Letter
      }
    }));

  }

  useEffect(() => {

    console.log('props',props)

    if(props.listGuid && props.listGuid != '') {
      getFAQItems();
    }
  
  },[props])
  

  return (
    <>
    <WebPartTitle displayMode={props.displayMode}
              title={props.title}
              updateProperty={props.updateProperty} />
    {props.listGuid ? faqItems.map((o:IFAQ,index:number) => {
      return (<Accordion key={index} title={o.Title} defaultCollapsed={true} >
        {o.Body}
      </Accordion> )
    }) : <Placeholder iconName='Edit'
    iconText='Configure your web part'
    description='Please configure the web part.'
    buttonLabel='Configure'
    onConfigure={() => props.context.propertyPane.open()}
    />}
    </>
   
  )
}

export default Faq

