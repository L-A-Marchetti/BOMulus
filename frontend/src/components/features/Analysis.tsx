// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { AnalysisStore } from '../../store/AnalysisStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Button from '../shared/Button';
import { useShallow } from 'zustand/react/shallow';
import Login from '../shared/Login';

export function Analysis(): React.JSX.Element {
  const { analysisStatus, startAnalysis, token, toggleLoginVisibility } =
    AnalysisStore(
      useShallow((state) => ({
        analysisStatus: state.analysisStatus,
        startAnalysis: state.startAnalysis,
        token: state.token,
        toggleLoginVisibility: state.toggleLoginVisibility,
      })),
    );

  const { components, isVisible } = CompareViewStore(
    useShallow((state) => ({
      components: state.components,
      isVisible: state.isVisible,
    })),
  );

  useEffect(() => {
    console.log('Analysis');
  }, []);

  return (
    <>
      <div className={components && isVisible ? 'w-full' : 'hidden'}>
        <div className="analysis">
          {analysisStatus?.Progress ? (
            <div className="progress_bar">
              <div
                className="progress_bar_graph"
                style={{
                  width: Math.round(analysisStatus?.Progress / 2) + '%',
                }}
              >
                <div>{Math.round(analysisStatus?.Progress / 2) + ' %'}</div>
              </div>
            </div>
          ) : (
            <Button
              onClick={token ? startAnalysis : toggleLoginVisibility}
              text="Analyze"
              bg="bg-neutral-700"
              bgHover="hover:bg-neutral-900"
              txtColor="text-neutral-400"
              h="h-15"
              img={null}
            />
          )}
        </div>
      </div>
      <Login />
    </>
  );
}
