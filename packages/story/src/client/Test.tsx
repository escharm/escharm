interface IProps {
  a: string;
}

const Test = (props: IProps) => {
  const { a } = props;
  return (
    <div data-id="Z-dDqMJMPX5qFrRSvmja7">
      <p data-id="3k1u2ohQLaMkRAfl6nRSa" style={{ height: 50 }}>
        {a}
      </p>
      <button data-id="SpAxCt61iEVAUiiaEHn16">Click me</button>
      <div data-id="OkUfGQ3ePnt5namfPf4Sv">
        <span data-id="tipv7O_5eLy789VGv7CXN">Nested content</span>
      </div>
    </div>
  );
};

export default Test;
