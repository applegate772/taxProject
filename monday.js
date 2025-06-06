const API_URL = 'https://api.monday.com/v2';

async function mondayApiCall(query, accessToken) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  const data = await response.json();
  if (data.errors) {
    throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

async function createDocument(accessToken, itemId, columnId) {
  const createDocQuery = `
    mutation {
      create_doc(location: {board: {item_id: ${itemId}, column_id: "${columnId}"}}) {
        id
        name
      }
    }
  `;
  const result = await mondayApiCall(createDocQuery, accessToken);
  return result.data.create_doc.id;
}

async function addContentToDocument(accessToken, docId, clientContent) {
  const deltaContent = {
    deltaFormat: [
      {
        insert: clientContent
      }
    ]
  };
  const addContentQuery = `
    mutation {
      create_doc_block(
        doc_id: ${docId},
        type: normal_text,
        content: """${JSON.stringify(deltaContent)}"""
      ) {
        id
      }
    }
  `;
  const result = await mondayApiCall(addContentQuery, accessToken);
  return result.data.create_doc_block.id;
}

async function createMondayDoc(accessToken, itemId, columnId, clientContent) {
  const docId = await createDocument(accessToken, itemId, columnId);
  await addContentToDocument(accessToken, docId, clientContent);
  return docId;
}

module.exports = { createMondayDoc };