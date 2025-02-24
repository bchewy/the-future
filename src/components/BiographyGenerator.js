import React, { useState } from 'react';

const BiographyGenerator = ({ onSelectBiography }) => {
  const [name, setName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Sample memory-sharing templates
  const biographyTemplates = [
    {
      id: 1,
      title: "A Cherished Memory",
      template: () => 
`One of my fondest memories with you was that summer afternoon at the lake. You always knew how to make even the simplest moments feel special. The way you'd laugh with your whole body is something I carry with me every day. 

I miss our conversations and your unique perspective that always helped me see things differently. You taught me so much about appreciating the little things in life.

Thank you for all the memories we created together. You continue to inspire me every day.`
    },
    {
      id: 2,
      title: "Life Lessons",
      template: () => 
`The wisdom you shared has guided me through so many of life's challenges. I remember how you always said that "the true measure of a life well-lived is in the hearts you've touched." Your kindness and generosity touched so many, including mine.

I still find myself asking "What would you do?" when facing difficult decisions. Your influence continues to shape who I am and who I strive to be.

Your legacy of love and compassion lives on through all of us who were fortunate enough to know you.`
    },
    {
      id: 3,
      title: "With Gratitude",
      template: () => 
`I'm forever grateful for the time we shared. You showed me what true strength looks like - not just in how you faced challenges, but in how you celebrated joys, both big and small.

I smile when I remember how you could light up a room just by walking in. Your energy was contagious, and your ability to make everyone feel important was a rare gift.

Thank you for the laughter, the lessons, and the love. Your impact on my life is immeasurable and everlasting.`
    }
  ];
  
  const handleGenerateBiographies = () => {
    setShowTemplates(true);
  };
  
  const handleSelectTemplate = (template) => {
    onSelectBiography(template());
  };
  
  return (
    <div className="biography-generator">
      {!showTemplates ? (
        <div className="biography-form">
          <h3>Share Your Memory</h3>
          <p>Use one of our templates to help you express your thoughts</p>
          
          <div className="form-group">
            <button onClick={handleGenerateBiographies} style={{
              padding: '10px 16px',
              backgroundColor: '#9370db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '10px'
            }}>
              View Memory Templates
            </button>
          </div>
        </div>
      ) : (
        <div className="biography-templates">
          <h3>Choose a Template</h3>
          
          <div className="templates-list">
            {biographyTemplates.map((template) => (
              <div 
                key={template.id} 
                className="template-card"
                onClick={() => handleSelectTemplate(template.template)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <h4>{template.title}</h4>
                <p className="template-preview" style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '10px 0'
                }}>
                  {template.template().substring(0, 100)}...
                </p>
                <button style={{
                  padding: '8px 12px',
                  backgroundColor: '#9370db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>Use This Template</button>
              </div>
            ))}
          </div>
          
          <button 
            className="back-button"
            onClick={() => setShowTemplates(false)}
            style={{
              padding: '8px 12px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default BiographyGenerator;
