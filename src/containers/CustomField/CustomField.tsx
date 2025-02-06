/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./CustomField.css";
import { Accordion, Checkbox, Tag, AsyncLoader, Button } from "@contentstack/venus-components";
import { useAppSdk } from "../../common/hooks/useAppSdk";
import { fetchTaxonomies, fetchTaxonomyTerms } from "../../services";

type termProps = {
  uid: string;
  name: string;
  terms:  termProps[] | [];
  type?: 'taxonomy';
  taxonomy_uid?: string;
};

type renderProps = termProps & {
  taxonomyIndex: number;
}

const CustomFieldExtension = () => {
  const [taxonomies, setTaxonomies] = useState<termProps[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<termProps[]>([]);

  const appSdk = useAppSdk()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { taxonomyUid } = e.target.dataset
    const { checked, value, id } = e.target;

    if (checked) {
      setSelectedTerms((prevValue: any) => {
        return prevValue.map((taxonomy: termProps) => {
          if (taxonomy.uid === taxonomyUid) {
            return {
              ...taxonomy,
              terms: [...taxonomy.terms, {
                uid: id,
                name: value,
              }]
            }
          }
          return taxonomy;
        })
      });
    } else {
      setSelectedTerms((prevValue) => {
        return prevValue.map((taxonomy) => {
          if (taxonomy.uid === taxonomyUid) {
            return {
              ...taxonomy,
              terms: taxonomy.terms.filter((term: {uid: string}) => term.uid !== id)
            }
          }
          return taxonomy;
        })
      });
    }

  }

  const fetchTaxonomyData = async () => {
    try {
      const taxonomiesRes = await fetchTaxonomies() // fetch taxonomies
      let allTaxonomies = taxonomiesRes.map((taxonomy: { uid: string, name: string }) => { // fetch all terms of each taxonomy
        return fetchTaxonomyTerms(taxonomy);
      })
      allTaxonomies = await Promise.all(allTaxonomies);
      setTaxonomies(allTaxonomies)
    } catch (error) {
      console.log("🚀 ~ fetchTaxonomies ~ error:", error);
    }
  }

  useEffect(() => {
    fetchTaxonomyData();
  }, [])

  useEffect(() => {
    const initialData = appSdk?.location?.CustomField?.field.getData();
    if (initialData?.data && initialData?.data?.length > 0) {
      setSelectedTerms(initialData.data);
    } else {
      const initialSelection = taxonomies.map((taxonomy: termProps) => ({uid: taxonomy.uid, name: taxonomy.name, terms: []}));
      setSelectedTerms(initialSelection);
    }
  }, [taxonomies])

  useEffect(() => {
    // update data in appSdk
    appSdk?.location?.CustomField?.field.setData({data: selectedTerms})
  }, [selectedTerms])

  if (!taxonomies?.length) {
    return (
      <div className="layout-container">
        <AsyncLoader color='#6C5CE7' testId='cs-async-loader' />
      </div>
    )
  }

  const recursiveRender = ({name, uid, terms, type, taxonomyIndex}: renderProps) => {
    return <Accordion
        title={name}
        addLeftComponent={ type === 'taxonomy' &&
          <Button tabIndex={0} onlyIcon={true} onlyIconHoverColor="primary" version="v2" icon="v2-DotsSixVertical" />
        }
        accordionDataCount={terms.length}
        noChevron={terms.length > 0 ? false : true}
        // isAccordionParent={type === 'taxonomy'}
        // isContainerization={type === 'taxonomy'}
        key={uid}
      >
        {terms.map((term: termProps) => (
          <div
            key={term.uid} 
            style={{marginLeft:`${type === 'taxonomy' ? '1.5rem':'inherit' }`}}
          >    
            <div className="term-container">
              <Checkbox name={term.uid} id={term.uid} value={term.name} data-taxonomy-uid={term.taxonomy_uid}
                checked={selectedTerms?.[taxonomyIndex]?.terms.find(({uid}: termProps) => uid === term.uid)}
                onChange={handleChange}
              />  
              {term?.terms?.length > 0 ? recursiveRender({...term , terms: [...term?.terms], taxonomyIndex}) 
                :  <label className="term-label"
                htmlFor={term.uid}
              >
                {term.name}
              </label>}
            </div>

          </div>
        ))}
   </Accordion>
  };

  return (
      <div className="ui-location-wrapper">
        {taxonomies?.length > 0 && taxonomies.map((taxonomy, index) => (
          <>
          <div className="taxonomy-selection">
            {selectedTerms?.length > 0 && selectedTerms?.[index]?.terms?.length 
              ? <Tag label={`${taxonomy.name} selections`} tags={
                selectedTerms?.[index]?.terms?.map((term: {name: string}) => term.name)
              } version='v2' />
            : ''}
          </div>

            <div className="taxonomy-container" key={taxonomy?.uid}>
              {recursiveRender({...taxonomy, taxonomyIndex: index})}
            </div>
          </>
        ))}
      </div>
  );
};

export default CustomFieldExtension;
