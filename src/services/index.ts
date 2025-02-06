import { buildNestedStructure } from "../common/utils/functions";

const getConfigOptions = (method: string) => {
  return {
    method: method,
    headers: {
      'authorization': process.env.REACT_APP_MANAGEMENT_TOKEN as string,
      'api_key': process.env.REACT_APP_API_KEY as string,
    }
  }
}

export const fetchTaxonomyTerms = async (taxonomy: {
    uid: string;
    name: string;
}) => {
  const response = await fetch(`https://api.contentstack.io/v3/taxonomies/${taxonomy.uid}/terms?depth=5`, getConfigOptions('GET'));
  const responseJson = await response.json();
  return {
    uid: taxonomy.uid,
    name: taxonomy.name,
    type: 'taxonomy',
    terms: buildNestedStructure(responseJson.terms) // build nested structure
  }
}

export const fetchTaxonomies = async () => {
  try {
    const response = await (await fetch('https://api.contentstack.io/v3/taxonomies', getConfigOptions('GET'))).json();
    return response.taxonomies;
  } catch (error) {
    console.error(error);
  }
}
